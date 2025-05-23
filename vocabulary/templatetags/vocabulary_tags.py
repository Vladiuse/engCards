from django import template

register = template.Library()

@register.inclusion_tag("vocabulary/card_template.html")
def show_card(card=None) -> dict:
    if card is None:
        card = {
            'pk': '{id}',
            'ru': '{ru}',
            'en': '{en}',
            'status': '{status}',
            'get_status_display': '{status_text}',
        }
    return {'word': card}