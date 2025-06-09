from collections import deque

game_states = {}

def init_game(battle_id, player1, player2, deck1, deck2):
    game_states[battle_id] = {
        "players": {
            player1: {
                "deck": deque(deck1),
                "hand": [],
                "bonus_cards": [],
                "prize_cards": [],
                "bench": [],
                "active": None,
                "trash": [],
                "is_ready": False,
            },
            player2: {
                "deck": deque(deck2),
                "hand": [],
                "bonus_cards": [],
                "prize_cards": [],
                "bench": [],
                "active": None,
                "trash": [],
                "is_ready": False,
            }
        },
        "turn": player1,
    }

def set_hand(battle_id, player, hand):
    game_states[battle_id]["players"][player]["hand"] = hand

def set_bonus_cards(battle_id, player, bonus_cards):
    game_states[battle_id]["players"][player]["bonus_cards"] = bonus_cards

def set_prize_cards(battle_id, player, prize_cards):
    game_states[battle_id]["players"][player]["prize_cards"] = prize_cards

def set_active_pokemon(battle_id, player, pokemon):
    game_states[battle_id]["players"][player]["active"] = pokemon

def set_bench(battle_id, player, bench_cards):
    game_states[battle_id]["players"][player]["bench"] = bench_cards

def mark_player_ready(battle_id, player):
    game_states[battle_id]["players"][player]["is_ready"] = True

def is_both_ready(battle_id):
    p1, p2 = game_states[battle_id]["players"].keys()
    return (game_states[battle_id]["players"][p1]["is_ready"] and
            game_states[battle_id]["players"][p2]["is_ready"])

def get_game_state(battle_id):
    return game_states[battle_id]

def set_game_state(battle_id, new_state):
    game_states[battle_id] = new_state