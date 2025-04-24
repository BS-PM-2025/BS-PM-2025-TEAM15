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
        
class StudentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRequest
        fields = '__all__'
        extra_kwargs = {
            'idr': {'read_only': True}
        }

class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'
        extra_kwargs = {
            'idr': {'read_only': True}
        }