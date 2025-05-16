######In here we will add the database stuctures#######
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

#מחלקה לקבלת סטטוסים
class request_status(models.Model):
    id_sending = models.IntegerField()
    importance = models.CharField(max_length=255)
    status = models.CharField(max_length=255) 
class StudentRequest(models.Model):
    idr = models.AutoField(primary_key=True)
    id_sending = models.IntegerField()
    id_receiving = models.IntegerField()
    importance = models.CharField(max_length=255)
    text = models.TextField()
    title = models.CharField(max_length=255)
    documents = models.FileField(upload_to='documents/', null=True, blank=True)  # uploaded file
    department = models.IntegerField()

#user class
class users(models.Model):
    _id = models.IntegerField()
    email = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    password = models.CharField(max_length=50)
    type = models.CharField(max_length=20,default="Student")

#Student class
class students(models.Model):
    user_id = models.IntegerField()
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    sum_points = models.IntegerField()
    average = models.FloatField()

#course class 
class courses(models.Model):
    name = models.CharField(max_length=200)
    lecturer = models.IntegerField()
    department = models.CharField(max_length=100)
    points = models.FloatField()

#StudentCourse class
class studcourses(models.Model):
    id_student = models.IntegerField()
    id_course = models.CharField(max_length=100)
    grade = models.IntegerField()
    start = models.DateField()
    finish = models.BooleanField()

#Department class
class departments(models.Model):
    department = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    year = models.IntegerField()
    depand_on = models.CharField(max_length=200)
    semester = models.CharField(max_length=50)