from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'card_trainer/card_trainer.html')

