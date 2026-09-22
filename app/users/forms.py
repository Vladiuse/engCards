from typing import ClassVar

from django.contrib.auth.forms import UserCreationForm

from users.models import User


class UserRegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields: ClassVar[list[str]] = ["username", "password1", "password2"]
