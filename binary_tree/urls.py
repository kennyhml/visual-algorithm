from django.urls import path # type: ignore[import]
from . import views

urlpatterns = [
    path("", views.home)
]