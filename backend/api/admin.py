from django.contrib import admin
from .models import Series, DataPoint

class DataPointInline(admin.TabularInline):
    model = DataPoint
    extra = 1
    ordering = ["timestamp"]

@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)
    inlines = [DataPointInline]

@admin.register(DataPoint)
class DataPointAdmin(admin.ModelAdmin):
    list_display = ("series", "timestamp", "value")
    list_filter = ("series",)
    ordering = ["timestamp"]
