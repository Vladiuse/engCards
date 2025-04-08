from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods
from django.views.generic import TemplateView

from .forms import UserRegisterForm


@login_required
@require_http_methods(
    ['GET'],
)
def logout_view(request):
    logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)


class RegisterView(TemplateView):
    template_name = 'registration/sign_up.html'

    def post(self, request, *args, **kwargs):
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
            login(request, user)
            next_url = request.POST.get('next')
            if next_url:
                return redirect(next_url)
            return HttpResponseRedirect('/')
        content = {
            'form': form,
        }
        return render(request, self.template_name, content)
