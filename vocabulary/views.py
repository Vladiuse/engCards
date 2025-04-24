from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from config import config
from vocabulary.user_vocabulary_stat import UserVocabularyStatCreator, UserVocabularyStatSerializer

from .constants import DEFAULT_VOCABULARY, USER_VOCABULARY
from .forms import WordPairForm
from .models import EnglishLevel, WordPair
from .permisions import IsOwnerPermission
from .serializers import WordPairSerializer
from .start_vocabulary_creator import StartVocabularyCreator


@api_view()
def api_root(request, format=None):  # noqa: A002
    data = {
        'some': reverse('vocabulary:api_root', request=request, format=format),
        'words': reverse('vocabulary:words-list', request=request, format=format),
    }
    return Response(data)


def vocabularys(request):
    eng = EnglishLevel.objects.all()
    colors = [
        '#90CAF9',
        '#81D4FA',
        '#A5D6A7',
        '#C5E1A5',
        '#FFF59D',
        '#FFE082',
        '#FFAB91',
    ]
    content = {
        'levels': list(zip(eng, colors)),
        'USER_VOCABULARY': USER_VOCABULARY,
        'DEFAULT_VOCABULARY': DEFAULT_VOCABULARY,
    }
    if request.user.is_authenticated:
        words_count = WordPair.objects.filter(owner=request.user).count
        content['words_count'] = words_count
    return render(request, 'vocabulary/vocabularys.html', content)


@login_required(redirect_field_name='next', login_url=reverse_lazy('users:sign_up'))
def create_vocabulary(request):
    if request.user.is_create_vocabulary:
        return redirect(reverse('vocabulary:user_vocabulary'))
    if request.user.words.count() >= config.VOCABULARY_CREATE_CARDS_COUNT:
        request.user.mark_create_start_vocabulary()
        return redirect(reverse('vocabulary:user_vocabulary'))
    cards_count = WordPair.objects.filter(owner=request.user).count()
    content = {
        'cards_count': cards_count,
        'cards_need': config.VOCABULARY_CREATE_CARDS_COUNT,
    }
    return render(request, 'vocabulary/create_vocabulary.html', content)


class AddCardToCreateVocabularyView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request, format=None): # noqa: A002
        serializer = WordPairSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            creator = StartVocabularyCreator()
            creator.add_card(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
def user_vocabulary(request):
    if not request.user.is_create_vocabulary:
        return redirect(reverse('vocabulary:create_vocabulary'))
    content = {
        'words': WordPair.objects.filter(owner=request.user),
        'word_statuses': WordPair.STATUSES,
        'form': WordPairForm(),
    }
    return render(request, 'vocabulary/user_vocabulary.html', content)


class UserVocabularyStatView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, format=None): # noqa: A002
        stat_creator = UserVocabularyStatCreator()
        user_vocabulary_stat = stat_creator.create_stat(user=request.user)
        serializer = UserVocabularyStatSerializer(user_vocabulary_stat)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WordPairView(ModelViewSet):
    serializer_class = WordPairSerializer
    permission_classes = [IsAuthenticated, IsOwnerPermission]

    def get_queryset(self):
        return WordPair.objects.filter(owner=self.request.user)


def test(request):
    return render(request, 'base.html')
