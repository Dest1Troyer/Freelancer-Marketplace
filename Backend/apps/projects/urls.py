from django.urls import path
from apps.projects.views import create_project, list_projects, list_client_projects, get_project, list_freelancer_active_projects, complete_project

urlpatterns = [
    path("create/", create_project),
    path("list/", list_projects),
    path("client/", list_client_projects),
    path("freelancer-active/", list_freelancer_active_projects),
    path("complete/", complete_project),
    path("<str:project_id>/", get_project),
]
