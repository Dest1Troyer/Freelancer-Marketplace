from mongoengine import Document, StringField, DecimalField, DateTimeField
import datetime

def _utcnow():
    return datetime.datetime.now(datetime.timezone.utc)

class Transaction(Document):
    project_id = StringField(required=True)
    project_title = StringField(required=True)
    client_email = StringField(required=True)
    freelancer_email = StringField(required=True)
    amount = DecimalField(required=True, precision=2)
    status = StringField(choices=["funded", "released", "refunded"], default="funded")
    created_at = DateTimeField(default=_utcnow)
    updated_at = DateTimeField(default=_utcnow)
