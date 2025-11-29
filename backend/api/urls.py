#────────────────────────────────────────────────────────#
#                                                        #
# urls.py                                                #   
# Defines the URLs for the application's API             #
#                                                        #
# Author: Jo Richmond                                    #
#                                                        #
#────────────────────────────────────────────────────────#

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SeriesViewSet, DataPointViewSet, forecast_view, acf_view, decompose_view, upload_timeseries_view
from .auth_views import signup_view, login_view, logout_view, user_view, csrf_view

router = DefaultRouter()
router.register(r"series", SeriesViewSet, basename="series")
router.register(r"points", DataPointViewSet, basename="points")

urlpatterns = [
    path("", include(router.urls)),
    path("forecast/", forecast_view, name="forecast"),
    path("acf/", acf_view, name="acf"),
    path("decompose/", decompose_view, name="decompose"),
    path("upload/", upload_timeseries_view, name="upload series"),
    path("auth/signup/", signup_view, name="signup"),
    path("auth/login/", login_view, name="login"),
    path("auth/logout/", logout_view, name="logout"),
    path("auth/user/", user_view, name="user"),
    path("auth/csrf/", csrf_view, name="csrf"),
]
