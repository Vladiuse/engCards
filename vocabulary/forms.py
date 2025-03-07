from django import forms

from .models import WordPair


class WordPairForm(forms.ModelForm):

    class Meta:
        model = WordPair
        fields = '__all__'