from card_trainer.types import RuEnPair, LangDirection
from .dto import CardWord


class CardWordCreator:

    def convert(self, item: RuEnPair, lang_direction: LangDirection) -> CardWord:
        if lang_direction == LangDirection.RU_EN:
            return CardWord(
                word=item.ru,
                translation=item.en,
                id=item.pk,
            )
        return CardWord(
            word=item.en,
            translation=item.ru,
            id=item.pk,
        )
