from django.urls import path
from .views import PokemonCardListView

urlpatterns = [
    path('pokemon/', PokemonCardListView.as_view(), name='pokemon-cards'),
]
