# src/llms/base.py

from abc import ABC, abstractmethod

class LLMBase(ABC):
    @abstractmethod
    async def guess_company(self, clues: str) -> str:
        """
        Given user-provided clues, guess the company name.
        """
        pass
