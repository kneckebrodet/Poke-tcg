import random

def shuffle_deck(deck):
    random.shuffle(deck)
    return deck

def deal_cards(deck, num):
    return [deck.pop() for _ in range(min(num, len(deck)))]

def has_basic_pokemon(cards):
    return any(card.get("supertype") == "たね" for card in cards)

def get_card_back_view(cards):
    card_back_url = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fit/w_828,h_1148/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-414w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQyMCIsInBhdGgiOiJcL2ZcLzRmNzcwNWVjLThjNDktNGVlZC1hNTZlLWMyMWYzOTg1MjU0Y1wvZGFoNDNjeS1hOGUxMjFjYi05MzRhLTQwZjYtOTdjNy1mYTJkNzcxMzBkZDUucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9GzaYS7sd8RPY5FlHca09J9ZQZ9D9zI69Ru-BsbkLDA"
    return [{**card, "image_url": card_back_url} for card in cards]

def format_game_state_for_player(game, username):
    opponent = [p for p in game["players"] if p != username][0]
    player = game["players"][username]
    opponent_player = game["players"][opponent]

    return {
        "playerOne": {
            "hand": player["hand"],
            "bench": player["bench"],
            "active": player["active"] or [],
            "prize": get_card_back_view(player["prize_cards"]),
            "deck": get_card_back_view(player["deck"]),
            "trash": get_card_back_view(player["trash"]),
        },
        "playerTwo": {
            "hand": get_card_back_view(opponent_player["hand"]),
            "bench": [],
            "active": [],
            "prize": get_card_back_view(opponent_player["prize_cards"]),
            "deck": get_card_back_view(opponent_player["deck"]),
            "trash": opponent_player["trash"],
        }
    }
