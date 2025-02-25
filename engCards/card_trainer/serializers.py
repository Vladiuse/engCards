from rest_framework import serializers
from .types import LangDirection


class TranslationDirectionSerializer(serializers.Serializer):
    direction = serializers.ChoiceField(choices=LangDirection.choices)

    def create(self, validated_data):
        return LangDirection(validated_data['direction'])

class CardWordSerializer(serializers.Serializer):
    word_id = serializers.CharField()
    word = serializers.CharField()
    translation = serializers.CharField()

class CardSerializer(serializers.Serializer):
    target = CardWordSerializer()
    answers = CardWordSerializer(many=True)
    lang_direction = serializers.ChoiceField(choices=LangDirection.choices)
