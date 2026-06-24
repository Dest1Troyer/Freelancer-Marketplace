from mongoengine import Document, StringField, DateTimeField
import datetime

class Project(Document):
    client_email = StringField(required=True)
    title = StringField(required=True)
    description = StringField(required=True)
    category = StringField(required=True)
    skills_required = StringField(default="")
    budget = StringField(required=True)
    project_type = StringField(choices=["fixed", "hourly"], default="fixed")
    status = StringField(choices=["open", "in-progress", "completed"], default="open")
    created_at = DateTimeField(default=datetime.datetime.utcnow)
