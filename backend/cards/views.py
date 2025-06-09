from rest_framework import generics
from .models import PokemonCard
from .serializers import PokemonCardSerializer
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class PokemonCardListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = PokemonCard.objects.all()
    serializer_class = PokemonCardSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = [
        'card_type', 'hp_type', 'supertype'
    ]

    search_fields = [
        'card_name', 'ability_name', 'attack_1_name', 'attack_2_name', 'ability_content', 'attack_1_description'
    ]

    ordering = ['card_name']
    ordering_fields = ['card_name', 'hp_num']
