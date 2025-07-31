from src.llms.factory import LLMFactory
import asyncio

def get_guess(message: str, model: str):
    llm = LLMFactory.get_llm(model)
    return asyncio.run(llm.guess_company(message))

def check_clue_fairness(clue: str, company: str, model: str):
    llm = LLMFactory.get_llm(model)
    return asyncio.run(llm.verify_clue_fairness(clue, company))
