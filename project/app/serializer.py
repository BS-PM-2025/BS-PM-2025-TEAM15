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
    department = serializers.CharField()  # 🔥 should be CharField, not IntegerField!
    documents = serializers.FileField(required=False)


class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'
        extra_kwargs = {
            'idr': {'read_only': True}
        }

class SearchSerializer(serializers.Serializer):
    _id = serializers.CharField()
    user_id = serializers.IntegerField()
    department = serializers.CharField()
    status = serializers.CharField()
    sum_points = serializers.IntegerField()
    average = serializers.IntegerField()

class Graph_courses(serializers.Serializer):
    name = serializers.CharField()
    status = serializers.CharField()
    year = serializers.CharField()
    semester = serializers.CharField()
    depend_on = serializers.CharField()

class grades_graph(serializers.Serializer):
        grade =serializers.IntegerField()
        name = serializers.CharField()