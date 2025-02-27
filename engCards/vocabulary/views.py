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

@api_view()
def api_root(request, format=None): # noqa: A002
    data = {
        "some": reverse('vocabulary:index', request=request, format=format),
        'words': reverse('vocabulary:wordpair-list', request=request, format=format),
    }
    return Response(data)


class UserVocabularyView(ModelViewSet):

    serializer_class = WordPairSerializer
    permission_classes = [IsAuthenticated, IsOwnerPermission]

    def get_queryset(self):
        return WordPair.objects.filter(owner=self.request.user)

@api_view(http_method_names=['GET', 'POST'])
def test(request):

    return Response({'data': 1})
    # if request.method != 'POST':
    #     # return Response({'method': 'not allowed', 'data': str(request)})
    #     return render(request, 'index.html')
    # data = {
    #     '1': 1,
    # }
    # print(request.data, type(request.data))
    # return Response(data)