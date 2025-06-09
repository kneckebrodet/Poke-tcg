from django.urls import re_path
from battle.consumers import BattleConsumer

websocket_urlpatterns = [
    # re_path(r"ws/battle/(?P<battle_id>\w{8}(-\w{4}){3}-\w{12})/$", BattleConsumer.as_asgi()),
    re_path(r"ws/battle/(?P<battle_id>[\w-]+)/$", BattleConsumer.as_asgi()),
]
