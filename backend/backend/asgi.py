import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

from django.core.asgi import get_asgi_application
get_asgi = get_asgi_application()
from accounts.jwt_auth_middleware import JWTAuthMiddleware
from accounts.routing import websocket_urlpatterns as accounts_ws
from backend.routing import websocket_urlpatterns as battle_ws


application = ProtocolTypeRouter(
    {
        'http': get_asgi,
        'websocket': AllowedHostsOriginValidator(
            JWTAuthMiddleware(URLRouter(accounts_ws + battle_ws))
        )
    }
)