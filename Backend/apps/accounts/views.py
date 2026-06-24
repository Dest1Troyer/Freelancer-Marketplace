from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.accounts.models import User
from rest_framework import status
import traceback

@api_view(["POST"])
def register(request):
    try:
        data = request.data
        email = data.get("email")
        if not email:
            return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects(email=email).first():
            return Response(
                {"message": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User(
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            email=email,
            password=data.get("password", ""),
            role=data.get("role", "freelancer"),
            country=data.get("country", "")
        )

        user.save()
        return Response({
            "message": "Account created successfully"
        })
    except Exception as e:
        print("REGISTER ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error during registration",
            "error": str(e),
            "traceback": traceback.format_exc()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def login(request):
    try:
        print("LOGIN API HIT")
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects(email=email).first()
        print("USER FOUND:", user)

        if not user:
            return Response({
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)

        if user.password != password:
            return Response({
                "message": "Invalid password"
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "message": "Login successful",
            "user": {
                "id": str(user.id),
                "first_name": getattr(user, 'first_name', ''),
                "last_name": getattr(user, 'last_name', ''),
                "email": getattr(user, 'email', ''),
                "role": getattr(user, 'role', ''),
                "country": getattr(user, 'country', ''),
                "headline": getattr(user, 'headline', ''),
                "bio": getattr(user, 'bio', ''),
                "skills": getattr(user, 'skills', ''),
                "hourly_rate": getattr(user, 'hourly_rate', ''),
                "profile_picture": getattr(user, 'profile_picture', '')
            }
        })
    except Exception as e:
        print("LOGIN ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error during login serialization",
            "error": str(e),
            "traceback": traceback.format_exc()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update_profile(request):
    try:
        data = request.data
        email = data.get("email")
        user = User.objects(email=email).first()

        if not user:
            return Response({
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)

        if "first_name" in data: user.first_name = data["first_name"]
        if "last_name" in data: user.last_name = data["last_name"]
        if "country" in data: user.country = data["country"]
        if "headline" in data: user.headline = data["headline"]
        if "bio" in data: user.bio = data["bio"]
        if "skills" in data: user.skills = data["skills"]
        if "hourly_rate" in data: user.hourly_rate = data["hourly_rate"]
        if "profile_picture" in data: user.profile_picture = data["profile_picture"]

        user.save()

        return Response({
            "message": "Profile updated successfully",
            "user": {
                "id": str(user.id),
                "first_name": getattr(user, 'first_name', ''),
                "last_name": getattr(user, 'last_name', ''),
                "email": getattr(user, 'email', ''),
                "role": getattr(user, 'role', ''),
                "country": getattr(user, 'country', ''),
                "headline": getattr(user, 'headline', ''),
                "bio": getattr(user, 'bio', ''),
                "skills": getattr(user, 'skills', ''),
                "hourly_rate": getattr(user, 'hourly_rate', ''),
                "profile_picture": getattr(user, 'profile_picture', '')
            }
        })
    except Exception as e:
        print("PROFILE UPDATE ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error during profile update",
            "error": str(e),
            "traceback": traceback.format_exc()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def health_check(request):
    if request.method == 'GET':
        try:
            user_count = User.objects.count()
            return Response({
                "status": "healthy",
                "database": "connected",
                "user_count": user_count,
                "message": "API and Database are reachable"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "unhealthy",
                "database": "failed",
                "error": str(e),
                "message": "Database connection failed. Check your MONGO_URI env variable in Render."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)