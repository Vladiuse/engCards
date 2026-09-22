from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


class Command(BaseCommand):
    help = "Create the superuser configured in settings, or reset the password of the existing one."

    @transaction.atomic
    def handle(self, *args: Any, **options: Any) -> None:  # noqa: ANN401, ARG002
        username = settings.DJANGO_SUPERUSER_USERNAME
        password = settings.DJANGO_SUPERUSER_PASSWORD
        if not username or not password:
            raise CommandError("DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD must be set")

        user_model = get_user_model()
        user = user_model.objects.filter(**{user_model.USERNAME_FIELD: username}).first()
        if user is None:
            user_model.objects.create_superuser(username=username, password=password)
            self.stdout.write(self.style.SUCCESS(f"Created superuser '{username}'"))
            return

        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(update_fields=["password", "is_staff", "is_superuser"])
        self.stdout.write(self.style.SUCCESS(f"Updated password of superuser '{username}'"))
