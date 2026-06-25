from django.urls import path
from apps.chat.views import send_message, get_chat_history, get_conversations

urlpatterns = [
    path("send/", send_message),
    path("history/", get_chat_history),
    path("conversations/", get_conversations),
]
