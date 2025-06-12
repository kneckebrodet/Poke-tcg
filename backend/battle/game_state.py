from collections import deque
from enum import Enum

class GamePhase(Enum):
    SETUP = "setup"  # Initial draw + active/bench selection
    MULLIGAN_CHECK = "mulligan_check"
    COINFLIP = "coinflip"
    SELECT_PRIZE = "select_prize"
    SELECT_ACTIVE = "select_active"
    SELECT_BENCH = "select_bench"
    MAIN_PHASE = "main_phase"
    ATTACK_PHASE = "attack_phase"
    END_TURN = "end_turn"
    GAME_OVER = "game_over"

game_states = {}

def init_game(battle_id, player1, player2, deck1, deck2, player1_channel, player2_channel):
    game_states[battle_id] = {
        "players": {
            player1: {
                "deck": deque(deck1),
                "hand": [],
                "reshuffles": 0,
                "failed_hands": [],
                "bonus_cards": [],
                "prize_cards": [],
                "bench": [],
                "active": None,
                "trash": [],
                "channel_name": player1_channel,
                "is_ready": False,
            },
            player2: {
                "deck": deque(deck2),
                "hand": [],
                "reshuffles": 0,
                "failed_hands": [],
                "bonus_cards": [],
                "prize_cards": [],
                "bench": [],
                "active": None,
                "trash": [],
                "channel_name": player2_channel,
                "is_ready": False,
            }
        },
        "turn": player1,
        "phase": GamePhase.SETUP.value,
    }

def update_deck(battle_id, player, deck):
    game_states[battle_id]["players"][player]["deck"] = deck

def set_hand(battle_id, player, hand, deck):
    game_states[battle_id]["players"][player]["hand"] = hand
    update_deck(battle_id, player, deck)

def set_reshuffles(battle_id, player, number_of_reshuffles):
    game_states[battle_id]["players"][player]["reshuffles"] = number_of_reshuffles

def set_failed_hands(battle_id, player, failed_hands):
    game_states[battle_id]["players"][player]["failed_hands"] = failed_hands 

def set_bonus_cards(battle_id, player, bonus_cards, deck):
    game_states[battle_id]["players"][player]["bonus_cards"] = bonus_cards
    update_deck(battle_id, player, deck)

def set_prize_cards(battle_id, player, prize_cards, deck):
    game_states[battle_id]["players"][player]["prize_cards"] = prize_cards
    update_deck(battle_id, player, deck)

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
    return game_states.get(battle_id)

def set_game_state(battle_id, new_state):
    game_states[battle_id] = new_state