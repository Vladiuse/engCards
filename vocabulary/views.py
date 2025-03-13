from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from config import config

from .forms import WordPairForm
from .models import WordPair, EnglishLevel
from .permisions import IsOwnerPermission
from .serializers import WordPairSerializer
from .start_vocabulary_creator import StartVocabularyCreator
from .constants import DEFAULT_VOCABULARY, USER_VOCABULARY


@api_view()
def api_root(request, format=None):  # noqa: A002
    data = {
        'some': reverse('vocabulary:api_root', request=request, format=format),
        'words': reverse('vocabulary:words-list', request=request, format=format),
    }
    return Response(data)

def vocabularys(request):
    eng =  EnglishLevel.objects.all()
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
        'levels': list( zip(eng, colors)),
        'USER_VOCABULARY': USER_VOCABULARY,
        'DEFAULT_VOCABULARY': DEFAULT_VOCABULARY,
    }
    if request.user.is_authenticated:
        words_count = WordPair.objects.filter(owner=request.user).count
        content['words_count'] = words_count
    return render(request, 'vocabulary/vocabularys.html', content)


class CreateVocabularyView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    renderer_classes = [
        JSONRenderer,
        TemplateHTMLRenderer,
    ]

    def get_renderers(self):
        if self.request.method == 'GET':
            return [TemplateHTMLRenderer()]
        return [JSONRenderer()]

    def get(self, request, *args, **kwargs):
        if request.user.is_create_vocabulary:
            return redirect(reverse('vocabulary:user_vocabulary'))
        cards_count = WordPair.objects.filter(owner=request.user).count()
        content = {
            'cards_count': cards_count,
            'cards_need': config.VOCABULARY_CREATE_CARDS_COUNT,
        }
        return Response(content, template_name='vocabulary/create_vocabulary.html')

    def post(self, request, format=None):
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


class UserVocabularyView(ModelViewSet):
    serializer_class = WordPairSerializer
    permission_classes = [IsAuthenticated, IsOwnerPermission]

    def get_queryset(self):
        return WordPair.objects.filter(owner=self.request.user)


def test(request):
    return render(request, 'base.html')
