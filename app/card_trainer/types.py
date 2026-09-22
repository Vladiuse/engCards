# ruff: noqa: A005
from enum import Enum
from typing import Protocol


class LangDirection(Enum):
    RU_EN = "ru_en"
    EN_RU = "en_ru"

    def reverse(self) -> "LangDirection":
        if self == LangDirection.RU_EN:
            return LangDirection.EN_RU
        return LangDirection.RU_EN

    @classmethod
    def get_choices(cls) -> list[str]:
        return [item.value for item in cls]


class RuEnPair(Protocol):
    ru: str
    en: str

    @property
    def pk(self) -> int: ...
