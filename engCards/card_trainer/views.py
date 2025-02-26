from rest_framework.decorators import api_view
from django.shortcuts import render
from django.http import HttpResponse
from vocabulary.models import EnglishLevel
from .serializers import TranslationDirectionSerializer, CardSerializer
from rest_framework.response import Response
from rest_framework import status
from .trainer.card_trainer import CardTrainer



def card_trainer(request):
    content = {
        'regimes': EnglishLevel.objects.all(),
        'has_words_to_train': True,
    }
    return render(request, 'card_trainer/card_trainer.html',content)

@api_view()
def get_card(request, format=None):
    serializer = TranslationDirectionSerializer(data=request.query_params)
    print(request.data)
    serializer.is_valid()
    lang_direction = serializer.save()
    card_trainer = CardTrainer()
    card = card_trainer.get_card(user=request.user, lang_direction=lang_direction)
    card_serializer = CardSerializer(card)
    return Response(card_serializer.data)
    # try:
    #     card = card_trainer.get_card(user=request.user, lang_direction=lang_direction)
    #     card_serializer = CardSerializer(card)
    #     return Response(card_serializer.data)
    # except :
    #     return Response(status=status.HTTP_204_NO_CONTENT)