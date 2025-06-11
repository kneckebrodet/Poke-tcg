import json
from battle.services.pending_game_tracker import (
    save_player_init,
    is_both_players_ready,
    get_ready_players
)
from battle.game_init import start_game_server_side, format_game_state_for_player
from battle.game_state import get_game_state

async def handle_game_init(consumer, data):
    player = consumer.user.username
    battle_id = consumer.battle_id
    player_deck = data.get("deck")

    save_player_init(battle_id, player, consumer.channel_name, player_deck)

    game = get_game_state(battle_id)
    print("HELLOHELLOOHE")
    if game:
        print(f"YES WE FOUND A STATE!!!!")
        await consumer.send(text_data=json.dumps({
            "type": "recover_game_state",
            "gameState": format_game_state_for_player(game, player),
        }))
        return

    if not is_both_players_ready(battle_id):
        await consumer.send(text_data=json.dumps({
            "type": "waiting_for_opponent",
            "message": "Waiting for opponent to initialize game."
        }))
        return

    # Both players ready, get their data
    players_data = get_ready_players(battle_id)
    sorted_players = sorted(players_data)
    (player_one, data_one), (player_two, data_two) = sorted_players

    await start_game_server_side(
        channel_layer=consumer.channel_layer,
        battle_id=battle_id,
        player_one=player_one,
        player_two=player_two,
        player_one_deck=data_one["deck"],
        player_two_deck=data_two["deck"],
        player_one_channel=data_one["channel_name"],
        player_two_channel=data_two["channel_name"]
    )
