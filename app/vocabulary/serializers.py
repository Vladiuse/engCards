from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import EnglishLevel, WordPair


class EnglishLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnglishLevel
        fields = '__all__'


class WordPairSerializer(serializers.ModelSerializer):
    status_text = serializers.SerializerMethodField()

    class Meta:
        model = WordPair
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=WordPair.objects.all(),
                fields=['owner', 'ru', 'en'],
            ),
        ]


    def get_status_text(self, obj) -> str:
        return obj.get_status_display()

    def to_internal_value(self, data) -> dict:
        data['owner'] = self.context['request'].user.pk
        return super().to_internal_value(data=data)
