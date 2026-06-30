from django.urls import path
from apps.reviews.views import submit_review, get_user_reviews

urlpatterns = [
    path("submit/", submit_review),
    path("user/", get_user_reviews),
]
