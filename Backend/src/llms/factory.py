# Here we are using the factory pattern to create LLM instances

from src.llms.openai_model import OpenAILangchainModel
from src.llms.llama_groq import GroqLangchainModel
from src.llms.base import LLMBase

class LLMFactory:
    @staticmethod
    def get_llm(model_type: str):
        model_type = model_type.lower()

        if model_type == "openai":
            return OpenAILangchainModel()
        elif model_type == "groq":
            return GroqLangchainModel()
        # elif model_type == "gemini":
        #     return GeminiLangchainModel()
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
