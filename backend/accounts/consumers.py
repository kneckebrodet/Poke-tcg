import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db.models import Count

connected_users = set()
deck_selections = {}

class OnlineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:
            await self.close()
            return
        self.user = user.username

        if self.user:
            connected_users.add(self.user)

        await self.channel_layer.group_add("lobby", self.channel_name)
        await self.channel_layer.group_add(f"user_{self.user}", self.channel_name)
        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "init",
            "current_user": self.user
        }))

        await self.channel_layer.group_send(
            "lobby",
            {
                "type": "user_list",
                "users": list(connected_users)
            }
        )

    async def disconnect(self, close_code):
        connected_users.discard(self.user)
        await self.channel_layer.group_discard("lobby", self.channel_name)
        await self.channel_layer.group_discard(f"user_{self.user}", self.channel_name)

        await self.channel_layer.group_send(
            "lobby",
            {
                "type": "user_list",
                "users": list(connected_users),
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type")

        if message_type == "challenge_request":
            to_user = data.get("to")
            from_user = self.user

            await self.channel_layer.group_send(
                f"user_{to_user}",
                {
                    "type": "challenge_notification",
                    "from": from_user,
                }
            )
        
        elif message_type == "challenge_declined":
            from_user = data.get("from")
            to_user = data.get("to")

            await self.channel_layer.group_send(
                f"user_{to_user}",
                {
                    "type": "challenge_declined_notification",
                    "from": from_user
                }
            )

        elif message_type == "challenge_accepted":
            from_user = self.user
            to_user = data.get("to")

            # Lazy imports inside the function to avoid early model loading
            from decks.models import Deck
            from accounts.models import CustomUser
            from decks.serializers import DeckSerializer

            @sync_to_async
            def get_user_decks(username):
                user = CustomUser.objects.get(username=username)
                decks = (
                    Deck.objects
                    .filter(user=user)
                    .annotate(card_count=Count("cards"))  # Count how many DeckCard objects per Deck
                    .filter(card_count=60)                 # Only decks with exactly 60 DeckCards
                    .prefetch_related("cards__card")      # Prefetch related DeckCard and PokemonCard
                )
                return DeckSerializer(decks, many=True).data

            from_user_decks = await get_user_decks(from_user)
            to_user_decks = await get_user_decks(to_user)

            await self.channel_layer.group_send(
                f"user_{to_user}",
                {
                    "type": "challenge_accepted_notification",
                    "decks": to_user_decks,
                }
            )
            await self.channel_layer.group_send(
                f"user_{from_user}",
                {
                    "type": "challenge_accepted_notification",
                    "decks": from_user_decks
                }
            )

        elif message_type == "cancel_matchmaking":
            to_user = data.get("to")
            from_user = self.user

            await self.channel_layer.group_send(
                f"user_{to_user}",
                {
                    "type": "cancel_matchmaking_notification",
                    "from": from_user,
                }
            )
        
        elif message_type == "opponent_left":
            to_user = data.get("to")
            from_user = self.user

            await self.channel_layer.group_send(
                f"user_{to_user}",
                {
                    "type": "opponent_left_notification",
                    "from": from_user, 
                }
            )

        elif message_type == "deck_selected":
            from_user = self.user
            deck = data.get("deck")
            opponent = data.get("opponent")

            match_key = frozenset([from_user, opponent])
            if match_key not in deck_selections:
                deck_selections[match_key] = {}

            deck_selections[match_key][from_user] = deck

            # If both players have selected a deck
            if len(deck_selections[match_key]) == 2:
                decks = deck_selections.pop(match_key)

                battle_id = str(uuid.uuid4())

                await self.channel_layer.group_send(
                    f"user_{from_user}",
                    {
                        "type": "start_battle_notification",
                        "battle_id": battle_id,
                        "opponent": opponent,
                        "opponent_deck": decks[opponent],
                        "deck": deck,
                    }
                )
                await self.channel_layer.group_send(
                    f"user_{opponent}",
                    {
                        "type": "start_battle_notification",
                        "battle_id": battle_id,
                        "opponent": from_user,
                        "opponent_deck": deck,
                        "deck": decks[opponent],
                    }
                )



    async def user_list(self, event):
        await self.send(text_data=json.dumps({
            "type": event["type"],
            "users": event["users"]
        }))

    async def challenge_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "challenge_notification",
            "from": event["from"]
        }))
    
    async def challenge_declined_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "challenge_declined",
            "from": event["from"]
        }))

    async def challenge_accepted_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "challenge_accepted",
            "decks": event.get("decks", [])
        }))

    async def cancel_matchmaking_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "cancel_matchmaking",
            "from": event["from"]
        }))

    async def opponent_left_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "opponent_left",
            "from": event["from"]
        }))

    async def start_battle_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "start_battle",
            "battle_id": event["battle_id"],
            "opponent": event["opponent"],
            "opponent_deck": event["opponent_deck"],
            "deck": event["deck"]
        }))