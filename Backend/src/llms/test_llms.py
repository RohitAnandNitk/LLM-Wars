# Here we test the LLM models using the factory pattern
# this is for testing purposes only we are not using this file.

import asyncio
from src.llms.factory import LLMFactory

async def test_guess(model_name: str, clues: str):
    llm = LLMFactory(model_name).get_llm()
    result = await llm.guess_company(clues)
    print(f"\n[Result from {model_name}] =>", result)

if __name__ == "__main__":
    model = "groq"  # or "openai"
    clues = "An e-commerce company founded by Jeff Bezos"
    asyncio.run(test_guess(model, clues))
