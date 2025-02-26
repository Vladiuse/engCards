
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView

from .forms import UserRegisterForm


class RegisterView(TemplateView):

    template_name = 'registration/sign_up.html'

    def post(self, request, *args, **kwargs):
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
            login(request,user)
            return HttpResponseRedirect('/')
        content = {
            'form': form,
        }
        return render(request, self.template_name, content)

