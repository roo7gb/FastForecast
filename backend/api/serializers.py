from rest_framework import serializers
from .models import Series, DataPoint

class DataPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPoint
        fields = ("id", "timestamp", "value")

class SeriesSerializer(serializers.ModelSerializer):
    points = DataPointSerializer(many=True, read_only=True)

    class Meta:
        model = Series
        fields = ("id", "name", "description", "points")
