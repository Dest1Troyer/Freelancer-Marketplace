from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.accounts.models import User


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