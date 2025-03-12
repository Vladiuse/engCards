from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from vocabulary.models import EnglishLevel
from vocabulary.constants import USER_VOCABULARY, DEFAULT_VOCABULARY
from .serializers import CardSerializer, CardTrainerSerializer
import random
from vocabulary.models import DefaultWord


def card_trainer(request):
    content = {
        'regimes': EnglishLevel.objects.all(),
        'has_words_to_train': True,
        'USER_VOCABULARY': USER_VOCABULARY,
        'DEFAULT_VOCABULARY': DEFAULT_VOCABULARY,
        'test_words': DefaultWord.objects.order_by('?')[:random.randint(9, 10)],
    }
    return render(request, 'card_trainer/card_trainer.html', content)


@api_view(['GET', 'POST', ])
def get_card(request):
    serializer = CardTrainerSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    card_trainer = serializer.save()
    card = card_trainer.create_card()
    card_serializer = CardSerializer(card)
    return Response(card_serializer.data)
    # try:
    #     card = card_trainer.get_card(user=request.user, lang_direction=lang_direction)
    #     card_serializer = CardSerializer(card)
    #     return Response(card_serializer.data)
    # except :
    #     return Response(status=status.HTTP_204_NO_CONTENT)
