import { streamGet } from './client';

export async function streamChat(message: string, onChunk: (text: string) => void): Promise<void> {
  const q = encodeURIComponent(message);
  await streamGet(`/chat/stream?q=${q}`, onChunk);
}
