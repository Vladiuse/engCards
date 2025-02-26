import random
from django.contrib.auth.models import User
from vocabulary.models import DefaultWord, WordPair
from card_trainer.types import LangDirection
from .converter import ConverterByLangDirection
from .dto import Card

converter = ConverterByLangDirection()

class CardTrainer:


    def get_card(self, user: User, lang_direction: LangDirection):
        word = self._get_word(user=user)
        answers = self._get_answers(user=user, word_to_exclude=word)
        self._add_target_word_to_answers_and_shufle(answers=answers, target_word=word)
        card_word = converter.convert(item=word, lang_direction=lang_direction)
        card_answers = []
        for answer in answers:
            card_word = converter.convert(item=answer, lang_direction=lang_direction.reverse())
            card_answers.append(card_word)
        return Card(
            target=card_word,
            answers=card_answers,
            lang_direction=lang_direction
        )

    def _get_word(self, user: User):
        return WordPair.objects.filter(owner=user).order_by('?').first()

    def _get_answers(self, user: User, word_to_exclude: WordPair) -> list[WordPair]:
        words_qs = WordPair.objects.filter(owner=user).exclude(pk=word_to_exclude.pk).order_by('?')[:5]
        return list(words_qs)

    def _add_target_word_to_answers_and_shufle(self, answers: list[WordPair], target_word: WordPair):
        answers.append(target_word)
        random.shuffle(answers)
