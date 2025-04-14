from rest_framework.decorators import api_view
from rest_framework import status
from bson import ObjectId
import dbcommands as db
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'home.html')

from .models import Counter

#react
from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *



class ReactView(APIView):
  
    serializer_class = ReactSerializer

    # def get(self, request):
    #     detail = [ {"name": detail.name,"detail": detail.detail} 
    #     for detail in React.objects.all()]
    #     return Response(detail)

    # def post(self, request):

    #     serializer = ReactSerializer(data=request.data)
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return  Response(serializer.data)
        
# class Student_personal_requests(APIView):
#     # @transaction.atomic
  
#     def get_next_sequence(self, name):
#         counter = db.counters.find_one_and_update(
#             {"_id": name},
#             {"$inc": {"seq": 1}},
#             upsert=True,
#             return_document=ReturnDocument.AFTER
#         )
#         return counter["seq"]


from .serializer import YourRequestSerializer  # ודא/י שאת מייבאת את הסריאלייזר המתאים

class Student_personal_requests(APIView):
    # @transaction.atomic
   
    # def get_next_sequence(self, name):
    #     counter = db.counters.find_one_and_update(
    #         {"_id": name},
    #         {"$inc": {"seq": 1}},
    #         upsert=True,
    #         return_document=ReturnDocument.AFTER
    #     )
    #     return counter["seq"]

    def filehandle(self,request):
        file = request.FILES.get('documents')

        if file:
            from django.core.files.storage import FileSystemStorage
            fs = FileSystemStorage()
            filename = fs.save(file.name, file)
            file_url = fs.url(filename)
        else:
            file_url = None

        return file_url
    def post(self, request):
        print("========== REQUEST DATA ==========")
        print(request.data)  # This shows the body data (JSON)
        print("==================================")

        data = request.data.copy()  # חשוב לעשות copy כדי לא לערוך ישירות את request.data
        # data["idr"] = self.get_next_sequence("student_requests_id")

        serializer = StudentRequestSerializer(data=data)
        if serializer.is_valid():
            data = serializer.validated_data
            file_url_res = self.filehandle(request)
            inserted = db.add_ask(
                data["id_sending"],
                data["id_receiving"],
                data["importance"],
                data["text"],
                data["title"],
                file_url_res,
                data["department"]
            )
            return Response({"success": True, "data": {"_id": str(inserted)}}, status=201)
        else:
            return Response({"success": False, "errors": serializer.errors}, status=400)
        #סטטוס בקשות 
from rest_framework.views import APIView
from rest_framework.response import Response
#from .models import YourRequestModel
from .serializer import YourRequestSerializer
from . import dbcommands as dbcom 

class RequestStatusView(APIView):
    def get(self, request):
        requests = dbcom.get_pending_asks_for_admin(2)  # אם צריך לפי משתמש, סנן לפי `request.user`
        serializer = RequestStatusserializer(requests, many=True)
        return Response(serializer.data)
        