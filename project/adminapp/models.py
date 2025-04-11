from django.db import models
#פונקציה שמחזירה ערך רץ 
#from .models import Counter
from django.db import transaction

# Create your models here.
from django.db import models

# Create your models here.


class React(models.Model):
    name = models.CharField(max_length=30)
    detail = models.CharField(max_length=500)

class Clicker(models.Model):
    amount = models.IntegerField()

class Counter(models.Model):
    _id = models.CharField(max_length=100, primary_key=True)  # שם המונה (למשל "student_requests_id")
    sequence_value = models.IntegerField(default=0)

    class Meta:
        db_table = "counters"
