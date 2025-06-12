from .utils import shuffle_deck, pop_cards, reshuffle_for_tane, has_basic_pokemon
from .game_state import init_game, update_deck, set_hand, set_reshuffles, get_game_state, set_prize_cards, set_bonus_cards, set_failed_hands
from battle.utils import format_game_state_for_player

async def start_game_server_side(channel_layer, battle_id, player_one, player_two, player_one_deck, player_two_deck, player_one_channel, player_two_channel):
    # Shuffle players decks
    p1_deck = shuffle_deck(player_one_deck["cards"])
    p2_deck = shuffle_deck(player_two_deck["cards"])

    # create a new game using battle id + players + decks
    init_game(battle_id, player_one, player_two, p1_deck, p2_deck, player_one_channel, player_two_channel)
    
    # initialize p1 hand and update deck
    p1_hand = pop_cards(p1_deck, 7) # deck => 53x cards
    set_hand(battle_id, player_one, p1_hand, p1_deck)
    update_deck(battle_id, player_one, p1_deck)

    # initialize p2 hand and update deck
    p2_hand = pop_cards(p2_deck, 7) # deck => 53x cards
    set_hand(battle_id, player_two, p2_hand, p2_deck)
    update_deck(battle_id, player_two, p2_deck)

    # reshuffle if no basic pokemon in hand
    if not has_basic_pokemon(p1_hand):
        p1_deck, p1_hand, p1_reshuffles, p1_failed_hands = reshuffle_for_tane(p1_deck, p1_hand)
        set_hand(battle_id, player_one, p1_hand, p1_deck) 
        set_reshuffles(battle_id, player_one, p1_reshuffles)
        set_failed_hands(battle_id, player_one, p1_failed_hands)
    if not has_basic_pokemon(p2_hand):
        p2_deck, p2_hand, p2_reshuffles, p2_failed_hands = reshuffle_for_tane(p2_deck, p2_hand)
        set_hand(battle_id, player_two, p2_hand, p2_deck) 
        set_reshuffles(battle_id, player_two, p2_reshuffles)
        set_failed_hands(battle_id, player_two, p2_failed_hands)

    # set prize cards for each player
    p1_prize = pop_cards(p1_deck, 6)
    set_prize_cards(battle_id, player_one, p1_prize, p1_deck)
    p2_prize = pop_cards(p2_deck, 6)
    set_prize_cards(battle_id, player_two, p2_prize, p2_deck)

    # set bonus cards for each player
    game = get_game_state(battle_id)
    p1_number_of_bonus_cards = game["players"][player_two]["reshuffles"]
    p1_bonus_cards = pop_cards(p1_deck, p1_number_of_bonus_cards)
    set_bonus_cards(battle_id, player_one, p1_bonus_cards, p1_deck)

    p2_number_of_bonus_cards = game["players"][player_one]["reshuffles"]
    p2_bonus_cards = pop_cards(p2_deck, p2_number_of_bonus_cards)
    set_bonus_cards(battle_id, player_two, p2_bonus_cards, p2_deck)

    p1_game_state = format_game_state_for_player(game, player_one)
    p2_game_state = format_game_state_for_player(game, player_two)

    await channel_layer.send(player_one_channel, {
        "type": "initial_hand",
        "game": p1_game_state,
    })

    await channel_layer.send(player_two_channel, {
        "type": "initial_hand",
        "game": p2_game_state,
    })
