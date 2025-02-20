from django.db import models

class EnglishLevel(models.Model):
    id = models.CharField(max_length=2, primary_key=True)
    name = models.CharField(max_length=20)
    start = models.PositiveIntegerField()
    end = models.PositiveIntegerField()

#
# class DefaultWord(models.Model):
#     number_in_dict = models.PositiveIntegerField()
#     en = models.CharField(max_length=100)
#     ru = models.CharField(max_length=100)
#     level = models.CharField(max_length=10)