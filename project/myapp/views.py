from django.shortcuts import render
from django.core.files.storage import default_storage

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
from . import dbcommands as dbcom
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

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
    @method_decorator(csrf_exempt, name='dispatch')
    def post(self, request):
        
        data = request.POST.copy() 
        data["idr"] = self.get_next_sequence("student_requests_id")
        documents_list = []
        serializer = StudentRequestSerializer(data=data)
        if serializer.is_valid():
                if request.FILES.getlist('documents'):
                    for doc in request.FILES.getlist('documents'):
                        filename = default_storage.save('documents/' + doc.name, doc)
                        documents_list.append(filename)

                data["documents"] = documents_list[0] if documents_list else None #expects file name 



                mongo_id = dbcom.add_ask(
                        data["id_sending"],
                        data["id_receiving"],
                        data["importance"],
                        data["text"],
                        data["title"],
                        documents_list,
                        data["department"]
                    )
                serializer.save(documents=documents_list[0] if documents_list else None)

                return Response({
                        "success": True,
                        "data": serializer.data,
                        "mongo_id": str(mongo_id)   
                    })
        else:
            print(serializer.errors)
            return Response({"success": False, "errors": serializer.errors}, status=400)
        