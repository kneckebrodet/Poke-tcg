import json
from battle.services.pending_game_tracker import (
    save_player_init,
    is_both_players_ready,
    get_ready_players,
    save_active_selection,
    is_both_players_selected,
    get_both_selections,
)
from battle.game_init import start_game_server_side, format_game_state_for_player
from battle.game_state import get_game_state, set_game_state, set_bonus_cards, GamePhase
from battle.utils import pop_cards

async def handle_game_init(consumer, data):
    player = consumer.user.username
    battle_id = consumer.battle_id
    player_deck = data.get("deck")

    save_player_init(battle_id, player, consumer.channel_name, player_deck)

    game = get_game_state(battle_id)
    if game:
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

async def handle_reshuffle(consumer):
    player = consumer.user.username
    battle_id = consumer.battle_id
    channel_layer = consumer.channel_layer

    game = get_game_state(battle_id)
    if not game:
        return

    opponent = [p for p in game["players"] if p != player][0]

    player_one_channel = game["players"][player]["channel_name"]
    player_two_channel = game["players"][opponent]["channel_name"]

    player_data = game["players"].get(player)
    if not player_data:
        return

    player_data["reshuffles"] += 1

    set_game_state(battle_id, game)

    p1_game_state = format_game_state_for_player(game, player)
    p2_game_state = format_game_state_for_player(game, opponent)

    await channel_layer.send(player_one_channel, {
        "type": "initial_hand",
        "game": p1_game_state,
    })

    await channel_layer.send(player_two_channel, {
        "type": "initial_hand",
        "game": p2_game_state,
    })

async def handle_draw_bonus_cards(consumer, data):
    player = consumer.user.username
    channel_layer = consumer.channel_layer
    battle_id = consumer.battle_id
    amount = data.get("amount")

    game = get_game_state(battle_id)
    if not game:
        return

    opponent = [p for p in game["players"] if p != player][0]

    player_one_channel = game["players"][player]["channel_name"]
    player_two_channel = game["players"][opponent]["channel_name"]

    player_data = game["players"].get(player)
    if not player_data:
        return 

    deck = player_data["deck"]
    bonus_cards = pop_cards(deck, amount)
    set_bonus_cards(battle_id, player, bonus_cards, deck)

    set_game_state(battle_id, game)

    p1_game_state = format_game_state_for_player(game, player)
    p2_game_state = format_game_state_for_player(game, opponent)

    await channel_layer.send(player_one_channel, {
        "type": "bonus_cards_dealt",
        "game": p1_game_state,
    })

    await channel_layer.send(player_two_channel, {
        "type": "bonus_cards_dealt",
        "game": p2_game_state,
    })

async def handle_select_active(consumer, data):
    player = consumer.user.username
    channel_layer = consumer.channel_layer
    battle_id = consumer.battle_id
    active_pokemon = data.get("active")
    bench_pokemon = data.get("bench")

    save_active_selection(battle_id, player, active_pokemon, bench_pokemon)

    if not is_both_players_selected(battle_id):
        await consumer.send(text_data=json.dumps({
            "type": "waiting_for_opponent_active_selection",
            "message": "Waiting for opponent to select active and bench."
        }))
        return

    # Now both players have selected
    selections = get_both_selections(battle_id)
    game = get_game_state(battle_id)
    if not game:
        return

    for pname, pdata in selections.items():
        player_data = game["players"].get(pname)
        if not player_data:
            continue

        active = player_data["active"]
        bench = player_data["bench"]
        hand = player_data["hand"]

        for pokemon in pdata["active"]:
            active.append(pokemon)
            try:
                hand.remove(pokemon)
            except ValueError:
                print(f"[{pname}] Could not remove active Pokémon: {pokemon}")

        for pokemon in pdata["bench"]:
            bench.append(pokemon)
            try:
                hand.remove(pokemon)
            except ValueError:
                print(f"[{pname}] Could not remove bench Pokémon: {pokemon}")

    game["phase"] = GamePhase.MAIN_PHASE.value
    set_game_state(battle_id, game)

    # Notify both players
    for pname in game["players"]:
        opponent = [p for p in game["players"] if p != pname][0]
        player_channel = game["players"][pname]["channel_name"]
        game_state = format_game_state_for_player(game, pname)

        await channel_layer.send(player_channel, {
            "type": "active_selected",
            "game": game_state,
        })

