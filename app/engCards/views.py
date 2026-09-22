from django.shortcuts import redirect, render, reverse


def index(request):
    return redirect(reverse("vocabulary:vocabularys"))

def elements(request):
    return render(request, "elements.html")
