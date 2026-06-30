from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.reviews.models import Review
from apps.projects.models import Project
from apps.accounts.models import User
from mongoengine.errors import ValidationError
import traceback

def serialize_review(review):
    reviewer = User.objects(email=review.reviewer_email).first()
    reviewer_name = f"{getattr(reviewer, 'first_name', '')} {getattr(reviewer, 'last_name', '')}".strip() if reviewer else "Anonymous"
    return {
        "id": str(review.id),
        "project_id": review.project_id,
        "reviewer_email": review.reviewer_email,
        "reviewer_name": reviewer_name,
        "reviewer_role": review.reviewer_role,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at.isoformat() if review.created_at else None
    }

@api_view(["POST"])
def submit_review(request):
    try:
        data = request.data
        project_id = data.get("project_id")
        reviewer_email = data.get("reviewer_email")
        reviewee_email = data.get("reviewee_email")
        reviewer_role = data.get("reviewer_role")
        rating = data.get("rating")
        comment = data.get("comment", "")

        if not all([project_id, reviewer_email, reviewee_email, reviewer_role, rating]):
            return Response({"message": "project_id, reviewer_email, reviewee_email, reviewer_role, and rating are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                return Response({"message": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"message": "Rating must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        # Find project
        try:
            project = Project.objects(id=project_id).first()
        except ValidationError:
            return Response({"message": "Invalid project_id format"}, status=status.HTTP_400_BAD_REQUEST)

        if not project:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        # Verify project is completed
        if project.status != "completed":
            return Response({"message": "Reviews can only be submitted for completed projects"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify reviewer is authorized and reviewee matches
        if reviewer_role == "client":
            if project.client_email != reviewer_email:
                return Response({"message": "You are not the client for this project"}, status=status.HTTP_403_FORBIDDEN)
            if project.hired_freelancer_email != reviewee_email:
                return Response({"message": "The reviewee is not the freelancer hired for this project"}, status=status.HTTP_400_BAD_REQUEST)
        elif reviewer_role == "freelancer":
            if project.hired_freelancer_email != reviewer_email:
                return Response({"message": "You are not the hired freelancer for this project"}, status=status.HTTP_403_FORBIDDEN)
            if project.client_email != reviewee_email:
                return Response({"message": "The reviewee is not the client for this project"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Invalid reviewer role"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if review already exists
        existing = Review.objects(project_id=project_id, reviewer_email=reviewer_email).first()
        if existing:
            return Response({"message": "You have already submitted a review for this project"}, status=status.HTTP_400_BAD_REQUEST)

        # Save review
        review = Review(
            project_id=project_id,
            reviewer_email=reviewer_email,
            reviewee_email=reviewee_email,
            reviewer_role=reviewer_role,
            rating=rating,
            comment=comment
        )
        review.save()

        return Response({
            "message": "Review submitted successfully",
            "review": serialize_review(review)
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("SUBMIT REVIEW ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_user_reviews(request):
    try:
        email = request.query_params.get("email")
        if not email:
            return Response({"message": "email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        reviews = Review.objects(reviewee_email=email).order_by("-created_at")
        
        count = len(reviews)
        avg_rating = 0.0
        breakdown = {
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0
        }

        if count > 0:
            total_score = 0
            for r in reviews:
                total_score += r.rating
                r_str = str(r.rating)
                if r_str in breakdown:
                    breakdown[r_str] += 1
            avg_rating = round(total_score / count, 1)

        serialized = [serialize_review(r) for r in reviews]

        return Response({
            "reviews": serialized,
            "stats": {
                "average_rating": avg_rating,
                "count": count,
                "breakdown": breakdown
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("GET USER REVIEWS ERROR:", str(e))
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
