from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'words', views.UserVocabularyView, basename='words')

app_name = 'vocabulary'

urlpatterns = [
    path('', views.user_vocabulary, name='user_vocabulary'),
    path('api-root/', views.api_root,name='api_root'),
    path('',include(router.urls)),
    path('test/', views.test),
    path('create_vocabulary/', views.create_vocabulary, name='create_vocabulary'),
]

