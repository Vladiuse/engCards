from django.urls import path

from . import views

app_name = 'card_trainer'

urlpatterns = [
    path('', views.card_trainer,name='card_trainer'),
    path('get-card/', views.get_card,name='get_card'),
]

