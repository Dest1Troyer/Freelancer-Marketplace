from django.urls import path
from apps.payments.views import release_payment, get_user_transactions

urlpatterns = [
    path("release/", release_payment),
    path("user/", get_user_transactions),
]
