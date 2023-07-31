from django.shortcuts import render # type: ignore[import]
from django.http import HttpResponse # type: ignore[import]



def home(request) -> HttpResponse:
    return render(request, "home.html")
