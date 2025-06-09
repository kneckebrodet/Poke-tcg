from rest_framework import generics, permissions
from .models import Deck
from .serializers import DeckSerializer

class CreateDeckView(generics.CreateAPIView): # requests.POST("api/", params={data})  # data = {"name": "deck1", "cards": [card1_id, card2_id... x60]}
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DeckSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UpdateDeckView(generics.UpdateAPIView):
    queryset = Deck.objects.all()
    serializer_class = DeckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)

class DeckDetailView(generics.RetrieveAPIView):
    queryset = Deck.objects.all()
    serializer_class = DeckSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeckListView(generics.ListAPIView):
    serializer_class = DeckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)

class DeckDeleteView(generics.DestroyAPIView):
    queryset = Deck.objects.all()
    serializer_class = DeckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)

