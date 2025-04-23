from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from vocabulary.models import EnglishLevel
from vocabulary.constants import USER_VOCABULARY, DEFAULT_VOCABULARY
from .serializers import CardSerializer, CardTrainerSerializer
import random
from vocabulary.models import DefaultWord, WordPair
from django.views.decorators.http import require_http_methods


@require_http_methods(['GET'])
def card_trainer(request):
    vocabulary_type = request.GET.get('vocabulary_type')
    level = request.GET.get('level')
    level = '' if level is None else level
    content = {
        'vocabulary_type': vocabulary_type,
        'level': level,
        'CARD_STATUS_LEARNED': WordPair.LEARNED,
        'CARD_STATUS_POSTPONED': WordPair.POSTPONED,
        'CARD_STATUS_LEARNING': WordPair.LEARNING,
    }
    return render(request, 'card_trainer/card_trainer.html', content)


@api_view(['GET'])
def get_card(request):
    serializer = CardTrainerSerializer(data=request.query_params, context={'request': request})
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
