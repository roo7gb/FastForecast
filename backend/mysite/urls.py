#────────────────────────────────────────────────────────#
#                                                        #
# urls.py                                                #   
# Defines the URLs for the project                       #
#                                                        #
# Author: Jo Richmond                                    #
#                                                        #
#────────────────────────────────────────────────────────#

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]

