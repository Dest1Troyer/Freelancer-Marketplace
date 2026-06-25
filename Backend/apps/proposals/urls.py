from django.urls import path
from apps.proposals.views import submit_proposal, list_project_proposals, list_freelancer_proposals, accept_proposal, reject_proposal

urlpatterns = [
    path("submit/", submit_proposal),
    path("project/", list_project_proposals),
    path("freelancer/", list_freelancer_proposals),
    path("accept/", accept_proposal),
    path("reject/", reject_proposal),
]
