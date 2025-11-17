from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SeriesViewSet, DataPointViewSet, forecast_view, acf_view

router = DefaultRouter()
router.register(r"series", SeriesViewSet, basename="series")
router.register(r"points", DataPointViewSet, basename="points")

urlpatterns = [
    path("", include(router.urls)),
    path("forecast/", forecast_view, name="forecast"),
    path("acf/", acf_view, name="acf"),
]
