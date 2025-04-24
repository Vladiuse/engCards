from rest_framework import serializers


class UserVocabularyStatSerializer(serializers.Serializer):
    cards_count = serializers.IntegerField()
    learning_count = serializers.IntegerField()
    learned_count = serializers.IntegerField()
    postponed_count = serializers.IntegerField()