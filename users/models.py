from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_create_vocabulary = models.BooleanField(default=False)
