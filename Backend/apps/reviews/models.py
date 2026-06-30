from mongoengine import Document, StringField, IntField, DateTimeField
import datetime

class Review(Document):
    project_id = StringField(required=True)
    reviewer_email = StringField(required=True)
    reviewee_email = StringField(required=True)
    reviewer_role = StringField(choices=["client", "freelancer"], required=True)
    rating = IntField(min_value=1, max_value=5, required=True)
    comment = StringField(default="")
    created_at = DateTimeField(default=datetime.datetime.utcnow)
