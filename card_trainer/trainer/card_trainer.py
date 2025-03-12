import random

from django.contrib.auth.models import AnonymousUser, User
from django.db.models.query import QuerySet
from vocabulary.constants import DEFAULT_VOCABULARY
from vocabulary.models import DefaultWord, EnglishLevel, WordPair

from card_trainer.types import LangDirection, RuEnPair

from .converter import ConverterByLangDirection
from .dto import Card

converter = ConverterByLangDirection()


class CardTrainer:
    default_words_queryset = DefaultWord.objects.all()
    user_queryset = WordPair.objects.all()

    def __init__(
        self,
        user: User | AnonymousUser,
        lang_direction: LangDirection,
        vocabulary_type: str,
        level: EnglishLevel | None = None,
    ):
        self.user = user
        self.level = level
        self.vocabulary_type = vocabulary_type
        self.lang_direction = lang_direction

    def __str__(self):
        return f'CardTrainer:{self.__dict__}'

    def _get_default_vocabulary_queryset(self) -> QuerySet[DefaultWord]:
        return CardTrainer.default_words_queryset.filter(number_in_dict__range=[self.level.start, self.level.end])

    def _get_user_vocabulary_queryset(self) -> QuerySet[WordPair]:
        return CardTrainer.user_queryset.filter(owner=self.user)

    def _get_queryset(self) -> QuerySet:
        if self.vocabulary_type == DEFAULT_VOCABULARY:
            return self._get_default_vocabulary_queryset()
        return self._get_user_vocabulary_queryset()

    def create_card(self) -> Card:
        word = self._get_word()
        answers = self._get_answers(word_to_exclude=word)
        self._add_target_word_to_answers_and_shufle(answers=answers, target_word=word)
        card_word = converter.convert(item=word, lang_direction=self.lang_direction)
        card_answers = []
        for answer in answers:
            card_word = converter.convert(item=answer, lang_direction=self.lang_direction.reverse())
            card_answers.append(card_word)
        return Card(
            card=card_word,
            answers=card_answers,
            lang_direction=self.lang_direction,
        )

    def _get_word(self) -> RuEnPair:
        return self._get_queryset().order_by('?').first()

    def _get_answers(self, word_to_exclude: RuEnPair) -> list[RuEnPair]:
        words_qs = self._get_queryset().exclude(pk=word_to_exclude.pk).order_by('?')[:5]
        return list(words_qs)

    def _add_target_word_to_answers_and_shufle(self, answers: list[RuEnPair], target_word: RuEnPair) -> None:
        answers.append(target_word)
        random.shuffle(answers)
