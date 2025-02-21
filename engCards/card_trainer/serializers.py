from rest_framework import serializers
from .types import LangDirection

class CardWordSerializer(serializers.Serializer):
    word_id = serializers.CharField()
    word = serializers.CharField()
    translation = serializers.CharField()

class CardSerializer(serializers.Serializer):
    target = CardWordSerializer()
    answers = CardWordSerializer(many=True)
    lang_direction = serializers.CharField(choices=[e.value for e in LangDirection])