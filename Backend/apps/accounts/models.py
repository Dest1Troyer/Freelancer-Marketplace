from mongoengine import Document
from mongoengine import StringField
from mongoengine import EmailField

class User(Document):

    first_name = StringField(required=True)

    last_name = StringField(required=True)

    email = EmailField(
        required=True,
        unique=True
    )

    password = StringField(required=True)

    role = StringField(
        choices=["client", "freelancer"]
    )

    country = StringField()
    
    headline = StringField(default="")
    bio = StringField(default="")
    skills = StringField(default="")
    hourly_rate = StringField(default="")
    profile_picture = StringField(default="")