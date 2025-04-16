from django.db import models

# Create your models here.
from django.db import models

#added by Rotem
from pymongo import MongoClient
from django.conf import settings

class React(models.Model):
    name = models.CharField(max_length=30)
    detail = models.CharField(max_length=500)

class Clicker(models.Model):
    amount = models.IntegerField()

# class User(models.Model): #creating user model
#     id = models.AutoField(primary_key=True)
#     email = models.EmailField(unique=True)
#     name = models.CharField(max_length=100)
#     password = models.CharField(max_length=12)
#     type = models.BooleanField(default=0)\

client = MongoClient(settings.MONGO_URI)
db = client["university_system"]
user_collection = db["users"]