from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from vocabulary.models import EnglishLevel

from .serializers import CardSerializer, CardTrainerSerializer


def card_trainer(request):
    content = {
        'regimes': EnglishLevel.objects.all(),
        'has_words_to_train': True,
    }
    return render(request, 'card_trainer/card_trainer.html', content)


@api_view()
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
