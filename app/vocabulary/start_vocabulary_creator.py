from users.models import User
from config import config
from vocabulary.models import WordPair

class StartVocabularyCreator:

    def add_card(self, user:User) -> None:
        user_cards_count = WordPair.objects.filter(owner=user).count()
        print(user_cards_count)
        if user_cards_count >= config.VOCABULARY_CREATE_CARDS_COUNT:
            user.mark_create_start_vocabulary()