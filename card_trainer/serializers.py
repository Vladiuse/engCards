from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from vocabulary.constants import DEFAULT_VOCABULARY, VOCABULARY_TYPES
from vocabulary.models import EnglishLevel

from card_trainer.trainer.card_trainer import CardTrainer

from .types import LangDirection


class CardTrainerSerializer(serializers.Serializer):
    lang_direction = serializers.ChoiceField(choices=LangDirection.choices)
    vocabulary_type = serializers.ChoiceField(choices=VOCABULARY_TYPES)
    level = serializers.PrimaryKeyRelatedField(queryset=EnglishLevel.objects.all(), required=False)

    def create(self, validated_data) -> CardTrainer:
        lang_direction = LangDirection(validated_data['lang_direction'])
        user = self.context['request'].user
        level = validated_data.get('level', None)
        vocabulary_type = validated_data['vocabulary_type']
        return CardTrainer(
            lang_direction=lang_direction,
            user=user,
            level=level,
            vocabulary_type=vocabulary_type,
        )

    def validate(self, attrs) -> dict:
        level = attrs.get('level', None)
        vocabulary_type = attrs.get('vocabulary_type')
        user = self.context['request'].user
        if isinstance(user, AnonymousUser) and not vocabulary_type == DEFAULT_VOCABULARY:
            raise ValidationError(f'AnonymousUser cat use only {DEFAULT_VOCABULARY}')
        if vocabulary_type == DEFAULT_VOCABULARY and not level:
            raise ValidationError(f'Set "level" for {DEFAULT_VOCABULARY}')
        return attrs


class CardWordSerializer(serializers.Serializer):
    id = serializers.CharField()
    word = serializers.CharField()
    translation = serializers.CharField()


class CardSerializer(serializers.Serializer):
    target = CardWordSerializer()
    answers = CardWordSerializer(many=True)
    lang_direction = serializers.ChoiceField(choices=LangDirection.choices)
