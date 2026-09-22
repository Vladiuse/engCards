from typing import Any, ClassVar

from django.db import models
from django.utils.translation import gettext_lazy as _

from . import validators


class EngCharField(models.CharField):
    default_validators: ClassVar[list[Any]] = [
        validators.eng_chars_validator,
    ]
    description = _("English text")

    def __init__(self, *args: Any, **kwargs: Any) -> None:  # noqa: ANN401
        kwargs.setdefault("max_length", 254)
        super().__init__(*args, **kwargs)


class RuCharField(models.CharField):
    default_validators: ClassVar[list[Any]] = [
        validators.ru_chars_validator,
    ]
    description = _("Russian text")

    def __init__(self, *args: Any, **kwargs: Any) -> None:  # noqa: ANN401
        kwargs.setdefault("max_length", 254)
        super().__init__(*args, **kwargs)
