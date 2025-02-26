from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import WordPair

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
        data['owner'] = self.context['request'].user.pk
        ret = super().to_internal_value(data)
        return ret