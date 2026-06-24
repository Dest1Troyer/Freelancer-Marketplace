from django.urls import path
from apps.projects.views import create_project, list_projects, list_client_projects, get_project

urlpatterns = [
    path("create/", create_project),
    path("list/", list_projects),
    path("client/", list_client_projects),
    path("<str:project_id>/", get_project),
]
