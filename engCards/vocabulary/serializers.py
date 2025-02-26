from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import WordPair
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import ValidationError

class WordPairSerializer(serializers.ModelSerializer):

    class Meta:
        model = WordPair
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=WordPair.objects.all(),
                fields=['owner', 'ru', 'en']
            )
        ]

    def to_internal_value(self, data):
        user = self.context['request'].user
        if not user.is_authenticated:
            raise ValidationError('Auth need')
        data['owner'] = self.context['request'].user.pk
        return super().to_internal_value(data)