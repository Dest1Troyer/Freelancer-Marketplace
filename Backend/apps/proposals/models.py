from mongoengine import Document, StringField, DateTimeField
import datetime

class Proposal(Document):
    project_id = StringField(required=True)
    freelancer_email = StringField(required=True)
    freelancer_name = StringField(default="")
    bid_amount = StringField(required=True)
    cover_letter = StringField(required=True)
    status = StringField(choices=["pending", "accepted", "rejected"], default="pending")
    created_at = DateTimeField(default=datetime.datetime.utcnow)
