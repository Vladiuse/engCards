from rest_framework import serializers

class CardWordSerializer(serializers.Serializer):
    word_id = serializers.CharField()
    word = serializers.CharField()
    translation = serializers.CharField()