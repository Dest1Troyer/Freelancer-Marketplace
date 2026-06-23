from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.accounts.models import User\


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
    print(request.data)

    email = request.data.get("email")
    password = request.data.get("password")

    user = User.objects(email=email).first()

    print("USER:", user)

    if not user:
        return Response({
            "message": "User not found"
        }, status=404)

    print("DB PASSWORD:", user.password)
    print("INPUT PASSWORD:", password)

    if user.password != password:
        return Response({
            "message": "Invalid password"
        }, status=401)

    return Response({
        "message": "Login successful"
    })