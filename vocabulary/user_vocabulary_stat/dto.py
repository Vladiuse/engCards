from dataclasses import dataclass


@dataclass(frozen=True)
class UserVocabularyStat:
    cards_count: int
    learning_count: int
    learned_count: int
    postponed_count: int