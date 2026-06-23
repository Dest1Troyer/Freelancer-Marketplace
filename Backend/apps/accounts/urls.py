from django.contrib import admin
from django.urls import path, include
from apps.accounts.views import *

urlpatterns = [
    # path("test/", test_api),
    path("login/", login),
    path("register/", register),
    
]
