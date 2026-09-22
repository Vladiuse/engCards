from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse


def index(request: HttpRequest) -> HttpResponse:  # noqa: ARG001
    return redirect(reverse("vocabulary:vocabularys"))


def elements(request: HttpRequest) -> HttpResponse:
    return render(request, "elements.html")
