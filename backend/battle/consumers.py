import json
from channels.generic.websocket import AsyncWebsocketConsumer
from battle.game_state import get_game_state, set_game_state
from battle.services.handle_game_init import handle_game_init


class BattleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.battle_id = self.scope["url_route"]["kwargs"]["battle_id"]
        self.group_name = f"battle_{self.battle_id}"

        if self.user.is_anonymous:
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Set channel_name in game state (if already initialized)
        username = self.user.username
        try:
            game = get_game_state(self.battle_id)
            if username in game["players"]:
                game["players"][username]["channel_name"] = self.channel_name
                set_game_state(self.battle_id, game)
        except:
            pass  # Game state not initialized yet, nothing to update

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type")

        if message_type == "game_init":
            await handle_game_init(self, data)

    async def initial_hand(self, event):

        await self.send(text_data=json.dumps({
            "type": "initial_game_state",
            "gameState": event["game"],
        }))


