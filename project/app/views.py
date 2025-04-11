from rest_framework.decorators import api_view
from rest_framework import status
from bson import ObjectId
import dbcommands
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'home.html')

from .models import Counter
from django.db import transaction

#react
from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *



class ReactView(APIView):
  
    serializer_class = ReactSerializer

    def get(self, request):
        detail = [ {"name": detail.name,"detail": detail.detail} 
        for detail in React.objects.all()]
        return Response(detail)

    def post(self, request):

        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)
        
class Student_personal_requests(APIView):
    @transaction.atomic
    def get_next_sequence(self, name):
        try:
            counter = Counter.objects.get(pk=name)
            counter.sequence_value += 1
        except Counter.DoesNotExist:
            counter = Counter(_id=name, sequence_value=1)
        
        counter.save()
        return counter.sequence_value


from .serializer import YourRequestSerializer  # ודא/י שאת מייבאת את הסריאלייזר המתאים

class Student_personal_requests(APIView):
    @transaction.atomic
    def get_next_sequence(self, name):
        try:
            counter = Counter.objects.get(pk=name)
            counter.sequence_value += 1
        except Counter.DoesNotExist:
            counter = Counter(_id=name, sequence_value=1)

        counter.save()
        return counter.sequence_value

    def post(self, request):
        data = request.data.copy()  # חשוב לעשות copy כדי לא לערוך ישירות את request.data
        data["idr"] = self.get_next_sequence("student_requests_id")

        serializer = YourRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        else:
            return Response({"success": False, "errors": serializer.errors}, status=400)