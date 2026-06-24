from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.proposals.models import Proposal
from apps.projects.models import Project
from apps.accounts.models import User
import traceback

def serialize_proposal(proposal):
    return {
        "id": str(proposal.id),
        "project_id": getattr(proposal, "project_id", ""),
        "freelancer_email": getattr(proposal, "freelancer_email", ""),
        "freelancer_name": getattr(proposal, "freelancer_name", ""),
        "bid_amount": getattr(proposal, "bid_amount", ""),
        "cover_letter": getattr(proposal, "cover_letter", ""),
        "created_at": proposal.created_at.isoformat() if getattr(proposal, "created_at", None) else None
    }

@api_view(["POST"])
def submit_proposal(request):
    try:
        data = request.data
        project_id = data.get("project_id")
        freelancer_email = data.get("freelancer_email")
        bid_amount = data.get("bid_amount")
        cover_letter = data.get("cover_letter")

        if not all([project_id, freelancer_email, bid_amount, cover_letter]):
            return Response({"message": "project_id, freelancer_email, bid_amount, and cover_letter are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify project exists
        project = Project.objects(id=project_id).first()
        if not project:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        # Verify freelancer user exists
        user = User.objects(email=freelancer_email).first()
        if not user:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if already submitted
        existing = Proposal.objects(project_id=project_id, freelancer_email=freelancer_email).first()
        if existing:
            return Response({"message": "You have already submitted a proposal for this project"}, status=status.HTTP_400_BAD_REQUEST)

        freelancer_name = f"{getattr(user, 'first_name', '')} {getattr(user, 'last_name', '')}".strip()

        proposal = Proposal(
            project_id=project_id,
            freelancer_email=freelancer_email,
            freelancer_name=freelancer_name,
            bid_amount=str(bid_amount),
            cover_letter=cover_letter
        )
        proposal.save()

        return Response({
            "message": "Proposal submitted successfully",
            "proposal": serialize_proposal(proposal)
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("SUBMIT PROPOSAL ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def list_project_proposals(request):
    try:
        project_id = request.query_params.get("project_id")
        if not project_id:
            return Response({"message": "project_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        proposals = Proposal.objects(project_id=project_id).order_by("-created_at")
        serialized = [serialize_proposal(p) for p in proposals]
        return Response(serialized, status=status.HTTP_200_OK)
    except Exception as e:
        print("LIST PROJECT PROPOSALS ERROR:", str(e))
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def list_freelancer_proposals(request):
    try:
        email = request.query_params.get("email")
        if not email:
            return Response({"message": "email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        proposals = Proposal.objects(freelancer_email=email).order_by("-created_at")
        serialized = [serialize_proposal(p) for p in proposals]
        return Response(serialized, status=status.HTTP_200_OK)
    except Exception as e:
        print("LIST FREELANCER PROPOSALS ERROR:", str(e))
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
