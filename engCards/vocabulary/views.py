from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.viewsets import ModelViewSet
from .models import WordPair
from .serializers import WordPairSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import  IsAuthenticated
from .permisions import IsOwnerPermission
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from .models import WordPair
from .forms import WordPairForm

@api_view()
def api_root(request, format=None): # noqa: A002
    data = {
        "some": reverse('vocabulary:api_root', request=request, format=format),
        'words': reverse('vocabulary:words-list', request=request, format=format),
    }
    return Response(data)

def create_word_pair(request):
    return render(request, 'vocabulary/word_create.html')

@login_required
def user_vocabulary(request):
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