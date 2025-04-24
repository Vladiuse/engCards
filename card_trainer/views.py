from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response

from vocabulary.constants import DEFAULT_VOCABULARY
from vocabulary.models import WordPair

from .serializers import CardSerializer, CardTrainerSerializer


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
        'DEFAULT_VOCABULARY': DEFAULT_VOCABULARY,
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
