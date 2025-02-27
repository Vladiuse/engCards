from django.contrib.auth.models import User
from django.db import models

from .fields import EngCharField, RuCharField


class EnglishLevel(models.Model):
    id = models.CharField(max_length=2, primary_key=True)
    name = models.CharField(max_length=20)
    start = models.PositiveIntegerField()
    end = models.PositiveIntegerField()


class DefaultWord(models.Model):
    number_in_dict = models.PositiveIntegerField()
    en = EngCharField(max_length=100)
    ru = RuCharField(max_length=100)


class WordPair(models.Model):
    LEARNED = 'learned'
    LEARNING = 'learning'
    POSTPONED = 'postponed'
    STATUSES = (
        (LEARNED, 'Выучено'),
        (LEARNING, 'Изучаю'),
        (POSTPONED, 'Отложено'),
    )
    en = EngCharField(max_length=100)
    ru = RuCharField(max_length=100)
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='words', related_query_name='word')
    created = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUSES, default=LEARNING)

    class Meta:
        unique_together = ('owner', 'en', 'ru')

    def __str__(self):
        return f'{self.en} - {self.ru}'


class Sentence(models.Model):
    words = models.ManyToManyField(to=WordPair, related_name='sentences', related_query_name='sentence')
    en = EngCharField(max_length=255)
    ru = RuCharField(max_length=255)
    owner = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='sentences',
        related_query_name='sentence',
    )
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.en)
