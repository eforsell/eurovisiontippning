from django.shortcuts import render


def home(request):
    return render(request, 'home.html')


def privacy(request):
    return render(request, 'privacy.html')
