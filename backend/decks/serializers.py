from rest_framework import serializers
from collections import Counter
from .models import Deck, DeckCard
from cards.models import PokemonCard
from cards.serializers import PokemonCardSerializer

class DeckCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeckCard
        fields = ['card']

class DeckSerializer(serializers.ModelSerializer):
    # Since deck model doesnt have a cards attribute, we have to handle this data in a special way using "serializerMethodField"
    # When using SerializerMethodField, you also need to create the actual method. We do this by naming it: 'get_' + <variable_name> (in this case; cards) 
    cards = serializers.SerializerMethodField()

    class Meta:
        model = Deck
        fields = ['id', 'name', 'cards', 'created_at']

    def get_cards(self, obj):
        return PokemonCardSerializer([dc.card for dc in obj.cards.all()], many=True).data

    def create(self, validated_data): # Validated data is only "name" here since id and created_at is automatically set (not inside the request data) and cards is handled as a MethodField.
        request = self.context.get('request')
        cards = request.data.get('cards', [])

        card_counts = Counter(cards) # Creates a dict-type object that counts amount of every card

        for card_id, count in card_counts.items():
            try:
                card = PokemonCard.objects.get(id=card_id)
            except PokemonCard.DoesNotExist:
                raise serializers.ValidationError(f"Card ID {card_id} not found.")

            if card.is_ace_spec and count > 1:
                raise serializers.ValidationError(f"Ace Spec card '{card.name}' can only appear once per deck.")

        deck = Deck.objects.create(user=request.user, name=validated_data['name'])
        for card_id in cards:
            DeckCard.objects.create(deck=deck, card_id=card_id)

        return deck