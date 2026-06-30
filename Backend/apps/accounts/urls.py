from django.contrib import admin
from django.urls import path, include
from apps.accounts.views import *

urlpatterns = [
    # path("test/", test_api),
    path("login/", login),
    path("register/", register),
    path("profile/update/", update_profile),
    path("profile/get/", get_user_profile),
    path("freelancers/", list_freelancers),
    path("health-check/",health_check)
]
