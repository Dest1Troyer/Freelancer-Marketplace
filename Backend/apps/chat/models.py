from mongoengine import Document, StringField, DateTimeField, BooleanField
import datetime

class Message(Document):
    sender_email = StringField(required=True)
    receiver_email = StringField(required=True)
    message_text = StringField(required=True)
    is_read = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
