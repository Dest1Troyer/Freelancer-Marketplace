from mongoengine import connect
from dotenv import load_dotenv
import os

load_dotenv()

print("MongoDB Connecting...")

connect(
    host=os.getenv("MONGO_URI")
)

print("MongoDB Connected")

print(os.getenv("MONGO_URI"))