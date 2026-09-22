# ruff: noqa: INP001
from typing import Any

from django import template

register = template.Library()


@register.inclusion_tag("vocabulary/card_template.html")
def show_card(card: Any = None) -> dict[str, Any]:  # noqa: ANN401
    if card is None:
        card = {
            "pk": "{id}",
            "ru": "{ru}",
            "en": "{en}",
            "status": "{status}",
            "get_status_display": "{status_text}",
        }
    return {"word": card}
