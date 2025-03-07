import re

from django.core.validators import ValidationError

ENG_CHARS_REGEX = r'^[A-Za-z]+$'
RU_CHARS_REGEX = r'^[А-Яа-яЁё]+$'


def remove_not_alpha_chars(string: str) -> str:
    return ''.join(char for char in string if char.isalpha())


def eng_chars_validator(value) -> None:
    value = remove_not_alpha_chars(string=value)
    if value == '':
        raise ValidationError('Слово должно быть из английских букв')
    if not re.match(ENG_CHARS_REGEX, value):
        raise ValidationError('Должны быть только английские буквы и символы')


def ru_chars_validator(value) -> None:
    value = remove_not_alpha_chars(string=value)
    if value == '':
        raise ValidationError('Слово должно быть из русских букв')
    if not re.match(RU_CHARS_REGEX, value):
        raise ValidationError('Должны быть только русские буквы и символы')
