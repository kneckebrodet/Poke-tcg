from .utils import shuffle_deck, deal_cards, get_card_back_view, has_basic_pokemon
from .game_state import init_game, set_hand, get_game_state, set_game_state, set_prize_cards, set_bonus_cards

async def start_game_server_side(channel_layer, battle_id, player_one, player_two, player_one_deck, player_two_deck, player_one_channel, player_two_channel):
    p1_deck = shuffle_deck(player_one_deck["cards"])
    p2_deck = shuffle_deck(player_two_deck["cards"])
    
    p1_hand = deal_cards(p1_deck, 7)
    p2_hand = deal_cards(p2_deck, 7)

    init_game(battle_id, player_one, player_two, p1_deck, p2_deck)
    set_hand(battle_id, player_one, p1_hand)
    set_hand(battle_id, player_two, p2_hand)

    game = get_game_state(battle_id)
    game["players"][player_one]["channel_name"] = player_one_channel
    game["players"][player_two]["channel_name"] = player_two_channel
    set_game_state(battle_id, game)

    # Check for tane
    p1_tane = has_basic_pokemon(p1_hand)
    p2_tane = has_basic_pokemon(p2_hand)
    p1_prize = []
    p2_prize = []

    if p1_tane:
        p1_prize = deal_cards(p1_deck, 6)
        set_prize_cards(battle_id, player_one, p1_prize)
        game["players"][player_one]["deck"] = p1_deck
    if p2_tane:
        p2_prize = deal_cards(p2_deck, 6)
        set_prize_cards(battle_id, player_two, p2_prize)
        game["players"][player_two]["prize_cards"] = p2_prize
    
    set_game_state(battle_id, game)

    # Send hand data
    await channel_layer.send(player_one_channel, {
        "type": "initial_hand",
        "yourHand": p1_hand,
        "yourPrize": get_card_back_view(p1_prize),
        "hasTane": p1_tane,
        "opponentHand": get_card_back_view(p2_hand),
        "opponentPrize": get_card_back_view(p2_prize),
        "opponentTane": p2_tane,
    })

    await channel_layer.send(player_two_channel, {
        "type": "initial_hand",
        "yourHand": p2_hand,
        "yourPrize": get_card_back_view(p2_prize),
        "hasTane": p2_tane,
        "opponentHand": get_card_back_view(p1_hand),
        "opponentPrize": get_card_back_view(p1_prize),
        "opponentTane": p1_tane,
    })
