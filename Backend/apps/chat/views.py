from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.chat.models import Message
from apps.accounts.models import User
from mongoengine import Q
import traceback

def serialize_message(msg):
    return {
        "id": str(msg.id),
        "sender_email": getattr(msg, "sender_email", ""),
        "receiver_email": getattr(msg, "receiver_email", ""),
        "message_text": getattr(msg, "message_text", ""),
        "is_read": getattr(msg, "is_read", False),
        "created_at": msg.created_at.isoformat() if getattr(msg, "created_at", None) else None
    }

@api_view(["POST"])
def send_message(request):
    try:
        data = request.data
        sender_email = data.get("sender_email")
        receiver_email = data.get("receiver_email")
        message_text = data.get("message_text")

        if not all([sender_email, receiver_email, message_text]):
            return Response({"message": "sender_email, receiver_email, and message_text are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify sender and receiver exist
        sender = User.objects(email=sender_email).first()
        receiver = User.objects(email=receiver_email).first()
        if not sender or not receiver:
            return Response({"message": "Sender or Receiver user not found"}, status=status.HTTP_404_NOT_FOUND)

        msg = Message(
            sender_email=sender_email,
            receiver_email=receiver_email,
            message_text=message_text
        )
        msg.save()

        return Response({
            "message": "Message sent successfully",
            "msg": serialize_message(msg)
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("SEND MESSAGE ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_chat_history(request):
    try:
        user_email = request.query_params.get("user_email")
        other_email = request.query_params.get("other_email")

        if not user_email or not other_email:
            return Response({"message": "user_email and other_email parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch messages
        messages = Message.objects(
            (Q(sender_email=user_email) & Q(receiver_email=other_email)) |
            (Q(sender_email=other_email) & Q(receiver_email=user_email))
        ).order_by("created_at")

        # Mark unread messages sent by the other user as read
        unread = Message.objects(
            sender_email=other_email,
            receiver_email=user_email,
            is_read=False
        )
        if unread.count() > 0:
            unread.update(is_read=True)

        serialized = [serialize_message(m) for m in messages]
        return Response(serialized, status=status.HTTP_200_OK)
    except Exception as e:
        print("GET CHAT HISTORY ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_conversations(request):
    try:
        email = request.query_params.get("email")
        if not email:
            return Response({"message": "email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find all messages involving this user
        messages = Message.objects(Q(sender_email=email) | Q(receiver_email=email)).order_by("-created_at")
        
        # Group by contact
        contacts = {}
        for msg in messages:
            other_email = msg.receiver_email if msg.sender_email == email else msg.sender_email
            if other_email not in contacts:
                contacts[other_email] = msg
        
        # For each contact, load user profile details and unread count
        conversations = []
        for contact_email, last_msg in contacts.items():
            user_obj = User.objects(email=contact_email).first()
            if not user_obj:
                user_info = {
                    "first_name": "Deleted",
                    "last_name": "User",
                    "email": contact_email,
                    "role": "unknown",
                    "profile_picture": ""
                }
            else:
                user_info = {
                    "first_name": getattr(user_obj, "first_name", ""),
                    "last_name": getattr(user_obj, "last_name", ""),
                    "email": contact_email,
                    "role": getattr(user_obj, "role", ""),
                    "profile_picture": getattr(user_obj, "profile_picture", "")
                }
                
            unread_count = Message.objects(
                sender_email=contact_email,
                receiver_email=email,
                is_read=False
            ).count()
            
            conversations.append({
                "contact": user_info,
                "last_message": {
                    "text": last_msg.message_text,
                    "created_at": last_msg.created_at.isoformat() if last_msg.created_at else None,
                    "sender_email": last_msg.sender_email
                },
                "unread_count": unread_count
            })
            
        return Response(conversations, status=status.HTTP_200_OK)
    except Exception as e:
        print("GET CONVERSATIONS ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
