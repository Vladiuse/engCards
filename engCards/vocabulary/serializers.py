from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import EnglishLevel, WordPair


class EnglishLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnglishLevel
        fields = '__all__'


class WordPairSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordPair
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=WordPair.objects.all(),
                fields=['owner', 'ru', 'en'],
            ),
        ]

    def to_internal_value(self, data) -> dict:
        from time import sleep
        sleep(1)
        data['owner'] = self.context['request'].user.pk
        return super().to_internal_value(data=data)
