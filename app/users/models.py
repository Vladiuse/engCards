from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_create_vocabulary = models.BooleanField(default=False)

    def mark_create_start_vocabulary(self) -> None:
        self.is_create_vocabulary = True
        self.save()
