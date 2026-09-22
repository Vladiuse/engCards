from typing import ClassVar

from django import forms

from .models import WordPair


class WordPairForm(forms.ModelForm):

    class Meta:
        model = WordPair
        fields: ClassVar[list[str]] = ["en", "ru", "status"]
