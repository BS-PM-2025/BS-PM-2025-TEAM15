from rest_framework.decorators import api_view
from rest_framework.response import Response
from dbcommands import users  # Directly import the users collection

@api_view(["GET"])
def show_first_user(request):
    user = users.find_one()
    if user:
        user["_id"] = str(user["_id"])  # MongoDB ObjectId to string
    return Response(user)

# Create your views here.
def home(request):
    return render(request, 'home.html')


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