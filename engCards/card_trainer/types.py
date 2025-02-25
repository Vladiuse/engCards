from enum import Enum
from typing import Protocol


class LangDirection(Enum):
    RU_EN = 'ru_en'
    EN_RU = 'en_ru'

    def reverse(self):
        if self == LangDirection.RU_EN:
            return LangDirection.EN_RU
        return LangDirection.RU_EN

    @classmethod
    @property
    def choices(cls):
        return [item.value for item in cls]


class RuEnPair(Protocol):
    id: int | str
    ru: str
    en: str
