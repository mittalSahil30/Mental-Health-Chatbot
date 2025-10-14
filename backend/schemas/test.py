from pydantic import BaseModel


class TestResultCreate(BaseModel):
    score: int
    interpretation: str
    date: str


class TestResultOut(BaseModel):
    id: int
    score: int
    interpretation: str
    date: str

    class Config:
        from_attributes = True
