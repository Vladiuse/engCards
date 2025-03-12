from dataclasses import dataclass

from card_trainer.types import LangDirection


@dataclass
class CardWord:
    id: int
    word: str
    translation: str


@dataclass
class Card:
    card: CardWord
    answers: list[CardWord]
    lang_direction: LangDirection