from django.urls import path
from .views import CreateDeckView, UpdateDeckView, DeckDetailView, DeckListView, DeckDeleteView

urlpatterns = [
    path('', DeckListView.as_view(), name='deck-list'),
    path('create/', CreateDeckView.as_view(), name='create-deck'),
    path('<int:pk>/', DeckDetailView.as_view(), name='deck-detail'),
    path('delete/<int:pk>/', DeckDeleteView.as_view(), name='deck-delete'),
    path('update/<int:pk>/', UpdateDeckView.as_view(), name='deck-update'),
]