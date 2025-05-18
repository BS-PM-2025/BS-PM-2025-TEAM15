########In here we will translate data from python to JSON###########
from rest_framework import serializers
from . models import *
from .models import Counter  # החליפי בשם של המודל שלך

#React_Test.
class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = React
        fields = ['name', 'detail']


class YourRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter  # שם המודל שאת משתמשת בו
        fields = '__all__'  # או רשימה מפורטת של שדות שאת רוצה כמו: ['idr', 'title', 'text', ...]
        extra_kwargs = {
            'idr': {'read_only': True}
        }

class RequestStatusserializer(serializers.ModelSerializer):
    class Meta:
        model = request_status  # שם המודל שאת משתמשת בו
        fields = '__all__'  # או רשימה מפורטת של שדות שאת רוצה כמו: ['idr', 'title', 'text', ...]
        
from rest_framework import serializers

class StudentRequestSerializer(serializers.Serializer):
    id_sending = serializers.IntegerField()
    id_receiving = serializers.IntegerField()
    importance = serializers.CharField()
    text = serializers.CharField()
    title = serializers.CharField()
    department = serializers.CharField()  
    documents = serializers.FileField(required=False)
    category = serializers.CharField()


class UserSignUpSerializer(serializers.ModelSerializer):
    # Student-specific fields added manually
    department = serializers.CharField(required=True)
    status = serializers.CharField(required=False)
    sum_points = serializers.IntegerField(required=False)
    average = serializers.IntegerField(required=False)

    class Meta:
        model = users
        fields = '__all__'
        extra_kwargs = {
            'idr': {'read_only': True}
        }

class SearchSerializer(serializers.Serializer):
    _id = serializers.CharField()
#Course - get all Courses.

class CourseSerializer(serializers.Serializer):
    _id = serializers.CharField() #object id
    name = serializers.CharField()
    lecturer = serializers.IntegerField()
    department = serializers.CharField()
    points = serializers.IntegerField()

class StudentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    department = serializers.CharField()
    status = serializers.CharField()
    sum_points = serializers.IntegerField()
    average = serializers.IntegerField()

class StudCourseSerializer(serializers.ModelSerializer):
  id_student=serializers.IntegerField()
  id_course=serializers.CharField()
  grade=serializers.IntegerField()
  start=serializers.DateField()
  finish=serializers.BooleanField()

class Graph_courses(serializers.Serializer):
    name = serializers.CharField()
    status = serializers.CharField()
    year = serializers.CharField()
    semester = serializers.CharField()
    depend_on = serializers.CharField()

class grades_graph(serializers.Serializer):
        grade =serializers.IntegerField()
        name = serializers.CharField()
        #average = serializers.IntegerField()
