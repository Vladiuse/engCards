from dataclasses import dataclass
from card_trainer.types import LangDirection

@dataclass
class CardWord:
    word_id: int
    word: str
    translation: str


@dataclass
class Card:
    target: CardWord
    answers = list[CardWord]
    lang_direction: LangDirection