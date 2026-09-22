from rest_framework import serializers

from .dto import UserVocabularyStat


class UserVocabularyStatSerializer(serializers.Serializer[UserVocabularyStat]):
    cards_count = serializers.IntegerField()
    learning_count = serializers.IntegerField()
    learned_count = serializers.IntegerField()
    postponed_count = serializers.IntegerField()
