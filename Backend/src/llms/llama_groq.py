# Here we are using the Groq model with Langchain

from langchain_groq import ChatGroq
from langchain.schema.messages import HumanMessage, SystemMessage
from src.config import settings
from src.llms.base import LLMBase


class GroqLangchainModel(LLMBase):
    def __init__(self):
        self.llm = ChatGroq(
            model="llama3-70b-8192",
            temperature=0.7,
            api_key=settings.GROQ_API_KEY,
        )

    async def guess_company(self, clues: str) -> str:
        print("Groq (Langchain) called")
        
        system_message = SystemMessage(content="""
            You are a smart assistant that guesses the name of a company based on user-provided clues.
            Respond only with the name of the company — no explanation or extra words.
            Note: Do **not** apply any formatting to the response.
        """)

        human_message = HumanMessage(content=f"""
            Clues: "{clues}"
            What is the name of the company?
        """)

        response = await self.llm.ainvoke([system_message, human_message])
        return response.content.strip()

    async def verify_clue_fairness(self, clue: str, company: str) -> bool:
        """
        Returns False if the clue reveals the company name directly or in any disguised form.
        """
        print("Groq (Langchain) verifying clue fairness")

        system_message = SystemMessage(content="""
            You are a judge that determines whether a clue unfairly reveals a company's name.
            If the clue mentions the company name directly, partially, or in disguised form (like spaced letters, symbols, or phonetics), return "NO".
            If the clue is fair and does not reveal the name in any form, return "YES".
            Respond strictly with "YES" or "NO" — no explanation.
        """)

        human_message = HumanMessage(content=f"""
            Company Name: "{company}"
            Clue: "{clue}"
            Does the clue reveal the company name directly or indirectly?
        """)

        response = await self.llm.ainvoke([system_message, human_message])
        answer = response.content.strip().upper()

        return answer == "YES"
