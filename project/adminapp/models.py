from django.db import models

# Create your models here.
from django.db import models

# Create your models here.


class React(models.Model):
    name = models.CharField(max_length=30)
    detail = models.CharField(max_length=500)

class Clicker(models.Model):
    amount = models.IntegerField()