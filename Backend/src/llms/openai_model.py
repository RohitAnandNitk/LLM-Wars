# Here we are using th e OpenAI model with Langchain

from langchain_community.chat_models import ChatOpenAI
from langchain.schema.messages import HumanMessage, SystemMessage
from src.config import settings
from src.llms.base import LLMBase


class OpenAILangchainModel(LLMBase):
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo", 
            temperature=0.7,
            openai_api_key=settings.OPENAI_API_KEY,
        )

    async def guess_company(self, clues: str) -> str:
        print("Groq (Langchain) called")
        
        system_message = SystemMessage(content="""
            You are a smart assistant that guesses the name of a company based on user-provided clues.
            Respond only with the name of the company — no explanation or extra words.
            Note : Do **not** apply any formatting to the response.
        """)

        human_message = HumanMessage(content=f"""
            Clues: "{clues}"
            What is the name of the company?
        """)

        response = await self.llm.ainvoke([system_message, human_message])
        return response.content.strip()
