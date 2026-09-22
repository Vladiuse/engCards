from django.db import models
from django.utils.translation import gettext_lazy as _

from . import validators


class EngCharField(models.CharField):
    default_validators = [
        validators.eng_chars_validator,
    ]
    description = _('English text')

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_length', 254)
        super().__init__(*args, **kwargs)


class RuCharField(models.CharField):
    default_validators = [
        validators.ru_chars_validator,
    ]
    description = _('Russian text')

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_length', 254)
        super().__init__(*args, **kwargs)
