from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),
    path('', include('vocabulary.urls')),
    path('card-trainer/', include('card_trainer.urls')),
]
