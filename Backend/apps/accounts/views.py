from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.accounts.models import User
from rest_framework import status


@api_view(["POST"])
def register(request):
    

    data = request.data

    if User.objects(email=data["email"]).first():

        return Response(
            {"message": "Email already exists"},
            status=400
        )

    user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        password=data["password"],
        role=data["role"],
        country=data["country"]
    )

    print("USER SAVED")
    user.save()


    return Response({
        "message": "Account created successfully"
    })


from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.accounts.models import User


@api_view(["POST"])
def login(request):
    
    print("LOGIN API HIT")

    email = request.data.get("email")
    password = request.data.get("password")

    user = User.objects(email=email).first()

    print("USER:", user)

    if not user:
        return Response({
            "message": "User not found"
        }, status=404)

    if user.password != password:
        return Response({
            "message": "Invalid password"
        }, status=401)

    return Response({
        "message": "Login successful",
        "user": {
            "id": str(user.id),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "country": user.country,
            "headline": getattr(user, 'headline', ''),
            "bio": getattr(user, 'bio', ''),
            "skills": getattr(user, 'skills', ''),
            "hourly_rate": getattr(user, 'hourly_rate', ''),
            "profile_picture": getattr(user, 'profile_picture', '')
        }
    })


@api_view(["POST"])
def update_profile(request):
    data = request.data
    email = data.get("email")
    user = User.objects(email=email).first()

    if not user:
        return Response({
            "message": "User not found"
        }, status=404)

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
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "country": user.country,
            "headline": getattr(user, 'headline', ''),
            "bio": getattr(user, 'bio', ''),
            "skills": getattr(user, 'skills', ''),
            "hourly_rate": getattr(user, 'hourly_rate', ''),
            "profile_picture": getattr(user, 'profile_picture', '')
        }
    })


@api_view(["GET"])
def health_check(request):
    if request.method == 'GET':
        # Render jab check karne aayega, usko yeh 200 OK mil jayega
        return Response({"status": "healthy", "message": "Login endpoint is reachable"}, status=status.HTTP_200_OK)