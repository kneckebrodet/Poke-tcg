_pending_game_inits = {}

def save_player_init(battle_id, player, channel_name, deck):
    if battle_id not in _pending_game_inits:
        _pending_game_inits[battle_id] = {}
    _pending_game_inits[battle_id][player] = {
        "channel_name": channel_name,
        "deck": deck
    }

def is_both_players_ready(battle_id):
    return len(_pending_game_inits.get(battle_id, {})) == 2

def get_ready_players(battle_id):
    data = _pending_game_inits.pop(battle_id, {})
    return list(data.items())  # returns [(player1, data1), (player2, data2)]
