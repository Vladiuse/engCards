from enum import Enum
from typing import Protocol


class LangDirection(Enum):
    RU_EN = 'ru_en'
    EN_RU = 'en_ru'

class RuEnPair(Protocol):
    id: int | str
    ru: str
    en: str
