from rest_framework import serializers
from . models import *

#React_Test.
class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = React
        fields = ['name', 'detail']
