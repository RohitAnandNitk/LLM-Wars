from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

# ✅ Load environment variables from `.env`
load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    GROQ_API_KEY: str

settings = Settings()
