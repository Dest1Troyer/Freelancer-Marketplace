from django.contrib import admin
from django.urls import path, include
from apps.accounts.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path("test/", test_api),
    
]
