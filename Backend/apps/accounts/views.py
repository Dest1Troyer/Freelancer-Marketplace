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
def get_user_profile(request):
    try:
        email = request.query_params.get("email")
        if not email:
            return Response({"message": "email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects(email=email).first()
        if not user:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Calculate rating
        from apps.reviews.models import Review
        reviews = Review.objects(reviewee_email=email)
        count = len(reviews)
        avg_rating = 0.0
        if count > 0:
            avg_rating = round(sum(r.rating for r in reviews) / count, 1)

        return Response({
            "first_name": getattr(user, 'first_name', ''),
            "last_name": getattr(user, 'last_name', ''),
            "email": getattr(user, 'email', ''),
            "role": getattr(user, 'role', ''),
            "country": getattr(user, 'country', ''),
            "headline": getattr(user, 'headline', ''),
            "bio": getattr(user, 'bio', ''),
            "skills": getattr(user, 'skills', ''),
            "profile_picture": getattr(user, 'profile_picture', ''),
            "average_rating": avg_rating,
            "review_count": count
        })
    except Exception as e:
        print("GET PROFILE ERROR:", str(e))
        return Response({"message": "Internal Server Error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
                "message": "Database connection failed. Check your MONGO_URI env variable."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def list_freelancers(request):
    try:
        search = request.query_params.get("search", "")
        skills = request.query_params.get("skills", "")
        min_rate = request.query_params.get("min_rate", "")
        max_rate = request.query_params.get("max_rate", "")
        country = request.query_params.get("country", "")

        from mongoengine.queryset.visitor import Q
        q_obj = Q(role="freelancer")

        if search:
            q_obj = q_obj & (
                Q(first_name__icontains=search) | 
                Q(last_name__icontains=search) | 
                Q(headline__icontains=search) | 
                Q(bio__icontains=search)
            )

        if skills:
            skill_list = [s.strip().lower() for s in skills.split(",") if s.strip()]
            for sk in skill_list:
                q_obj = q_obj & Q(skills__icontains=sk)

        if country:
            q_obj = q_obj & Q(country__icontains=country)

        freelancers = User.objects(q_obj)

        filtered = []
        from apps.reviews.models import Review

        for user in freelancers:
            rate_val = None
            if getattr(user, "hourly_rate", ""):
                try:
                    cleaned_rate = str(user.hourly_rate).replace("$", "").strip()
                    rate_val = float(cleaned_rate)
                except ValueError:
                    pass

            if min_rate:
                try:
                    if rate_val is None or rate_val < float(min_rate):
                        continue
                except ValueError:
                    pass

            if max_rate:
                try:
                    if rate_val is None or rate_val > float(max_rate):
                        continue
                except ValueError:
                    pass

            # Aggregate ratings
            reviews = Review.objects(reviewee_email=user.email)
            count = len(reviews)
            avg_rating = 0.0
            if count > 0:
                avg_rating = round(sum(r.rating for r in reviews) / count, 1)

            filtered.append({
                "first_name": getattr(user, 'first_name', ''),
                "last_name": getattr(user, 'last_name', ''),
                "email": getattr(user, 'email', ''),
                "country": getattr(user, 'country', ''),
                "headline": getattr(user, 'headline', ''),
                "bio": getattr(user, 'bio', ''),
                "skills": getattr(user, 'skills', ''),
                "profile_picture": getattr(user, 'profile_picture', ''),
                "hourly_rate": getattr(user, 'hourly_rate', ''),
                "average_rating": avg_rating,
                "review_count": count
            })

        return Response(filtered, status=status.HTTP_200_OK)

    except Exception as e:
        print("LIST FREELANCERS ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)