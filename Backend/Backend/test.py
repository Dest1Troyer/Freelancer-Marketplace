from mongoengine import connect, Document, StringField

connect(
    host="mongodb+srv://bansaltanish12:freelancer1-1marketplace@freelancer.sn1skeu.mongodb.net/?appName=freelancer"
)

class Test(Document):
    name = StringField()

t = Test(name="Hello Mongo")
t.save()

print("Saved")