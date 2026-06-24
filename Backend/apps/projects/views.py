from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.projects.models import Project
from apps.accounts.models import User
from mongoengine.errors import ValidationError
import traceback

def serialize_project(project):
    return {
        "id": str(project.id),
        "client_email": getattr(project, "client_email", ""),
        "title": getattr(project, "title", ""),
        "description": getattr(project, "description", ""),
        "category": getattr(project, "category", ""),
        "skills_required": getattr(project, "skills_required", ""),
        "budget": getattr(project, "budget", ""),
        "project_type": getattr(project, "project_type", "fixed"),
        "status": getattr(project, "status", "open"),
        "created_at": project.created_at.isoformat() if getattr(project, "created_at", None) else None
    }

@api_view(["POST"])
def create_project(request):
    try:
        data = request.data
        client_email = data.get("client_email")
        if not client_email:
            return Response({"message": "Client email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify user exists
        user = User.objects(email=client_email).first()
        if not user:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Create project
        project = Project(
            client_email=client_email,
            title=data.get("title", ""),
            description=data.get("description", ""),
            category=data.get("category", ""),
            skills_required=data.get("skills_required", ""),
            budget=data.get("budget", ""),
            project_type=data.get("project_type", "fixed"),
            status="open"
        )
        project.save()
        
        return Response({
            "message": "Project posted successfully",
            "project": serialize_project(project)
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("CREATE PROJECT ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def list_projects(request):
    try:
        # Return all projects that are open
        projects = Project.objects(status="open").order_by("-created_at")
        serialized = [serialize_project(p) for p in projects]
        return Response(serialized, status=status.HTTP_200_OK)
    except Exception as e:
        print("LIST PROJECTS ERROR:", str(e))
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def list_client_projects(request):
    try:
        email = request.query_params.get("email")
        if not email:
            return Response({"message": "Email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        projects = Project.objects(client_email=email).order_by("-created_at")
        serialized = [serialize_project(p) for p in projects]
        return Response(serialized, status=status.HTTP_200_OK)
    except Exception as e:
        print("LIST CLIENT PROJECTS ERROR:", str(e))
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_project(request, project_id):
    try:
        try:
            project = Project.objects(id=project_id).first()
        except ValidationError:
            return Response({"message": "Invalid Project ID format"}, status=status.HTTP_400_BAD_REQUEST)
            
        if not project:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_project(project), status=status.HTTP_200_OK)
    except Exception as e:
        print("GET PROJECT ERROR:", str(e))
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
