# pending for deck selection from both players
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



# pending for active + bench from both players
_pending_active_selections = {}

def save_active_selection(battle_id, player, active, bench):
    if battle_id not in _pending_active_selections:
        _pending_active_selections[battle_id] = {}
    _pending_active_selections[battle_id][player] = {
        "active": active,
        "bench": bench,
    }

def is_both_players_selected(battle_id):
    return battle_id in _pending_active_selections and len(_pending_active_selections[battle_id]) == 2

def get_both_selections(battle_id):
    return _pending_active_selections.pop(battle_id)
