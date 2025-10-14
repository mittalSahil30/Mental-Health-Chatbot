from typing import AsyncIterator, Optional
from contextlib import asynccontextmanager
import asyncio

try:
    from google import genai
except Exception:  # pragma: no cover
    genai = None  # type: ignore

from ..core.config import settings


class MockStream:
    def __init__(self, text: str):
        self.text = text

    async def __aiter__(self):
        # naive chunking
        for chunk in [self.text[i : i + 40] for i in range(0, len(self.text), 40)]:
            await asyncio.sleep(0.05)
            yield chunk


async def get_chat_stream(prompt: str, system_instruction: str) -> AsyncIterator[str]:
    if not settings.GEMINI_API_KEY or genai is None:
        text = (
            "[Mock AI] "
            "Gemini key not configured. Here's a friendly placeholder response. "
            "Tell me how you're feeling today, and I can suggest a mindfulness tip."
        )
        async for chunk in MockStream(text):
            yield chunk
        return

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    model = settings.GEMINI_MODEL

    # Use the new responses API
    response = client.responses.stream(
        model=model,
        contents=[
            {"role": "user", "parts": [{"text": prompt}]},
            {"role": "model", "parts": [{"text": system_instruction}]},
        ],
        config={
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
        },
    )

    response.resolve()  # ensure headers
    async for event in response:  # type: ignore
        if getattr(event, "type", None) == "response.delta":  # chunk of text
            yield getattr(event.delta, "text", "")


def build_system_instruction(user_name: str, is_guest: bool, test_summary: Optional[str], journal_summary: Optional[str]) -> str:
    base = (
        "You are 'Serene', a compassionate, empathetic mental wellness assistant. "
        "Do not provide medical advice or diagnosis. Encourage seeking professional help for clinical concerns. "
        f"You are speaking with {user_name}. "
    )
    if is_guest:
        base += "They are using guest mode. "
    if test_summary:
        base += f"Recent wellness context: {test_summary}. "
    if journal_summary:
        base += f"They recently wrote about: {journal_summary}. "
    base += (
        "Be gentle, concise, supportive; offer mindfulness or journaling prompts; ask clarifying questions."
    )
    return base
