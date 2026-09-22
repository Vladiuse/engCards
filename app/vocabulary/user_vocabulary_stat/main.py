from vocabulary.models import WordPair
from users.models import User
from .dto import UserVocabularyStat
from django.db.models import Count

class UserVocabularyStatCreator:

    def create_stat(self, user: User) -> UserVocabularyStat:
        cards_stat = list(WordPair.objects.filter(owner=user).values('status').annotate(count=Count('*')))
        cards_status_stat_dict = {item['status']: item['count'] for item in cards_stat}
        total_count = sum(cards_status_stat_dict.values())
        return UserVocabularyStat(
            cards_count=total_count,
            learned_count=cards_status_stat_dict.get(WordPair.LEARNED, 0),
            learning_count=cards_status_stat_dict.get(WordPair.LEARNING, 0),
            postponed_count=cards_status_stat_dict.get(WordPair.POSTPONED, 0),
        )