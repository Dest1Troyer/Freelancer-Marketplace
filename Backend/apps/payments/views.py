from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.payments.models import Transaction
from mongoengine.queryset.visitor import Q
from mongoengine.errors import ValidationError
import datetime
import traceback

def serialize_transaction(tx):
    return {
        "id": str(tx.id),
        "project_id": tx.project_id,
        "project_title": tx.project_title,
        "client_email": tx.client_email,
        "freelancer_email": tx.freelancer_email,
        "amount": str(tx.amount),
        "status": tx.status,
        "created_at": tx.created_at.isoformat() if tx.created_at else None,
        "updated_at": tx.updated_at.isoformat() if tx.updated_at else None
    }

@api_view(["POST"])
def release_payment(request):
    try:
        data = request.data
        transaction_id = data.get("transaction_id")
        project_id = data.get("project_id")
        client_email = data.get("client_email")

        if not client_email:
            return Response({"message": "client_email is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not transaction_id and not project_id:
            return Response({"message": "Either transaction_id or project_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        transaction = None
        if transaction_id:
            try:
                transaction = Transaction.objects(id=transaction_id).first()
            except ValidationError:
                return Response({"message": "Invalid transaction_id format"}, status=status.HTTP_400_BAD_REQUEST)
        elif project_id:
            transaction = Transaction.objects(project_id=project_id, status="funded").first()

        if not transaction:
            return Response({"message": "Escrow transaction not found"}, status=status.HTTP_404_NOT_FOUND)

        if transaction.client_email != client_email:
            return Response({"message": "Unauthorized. You do not own this transaction."}, status=status.HTTP_403_FORBIDDEN)

        if transaction.status != "funded":
            return Response({"message": f"Escrow cannot be released. Current status is '{transaction.status}'"}, status=status.HTTP_400_BAD_REQUEST)

        # Release payment
        transaction.status = "released"
        transaction.updated_at = datetime.datetime.now(datetime.timezone.utc)
        transaction.save()

        return Response({
            "message": "Escrow payment released successfully.",
            "transaction": serialize_transaction(transaction)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("RELEASE PAYMENT ERROR:", str(e))
        traceback.print_exc()
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_user_transactions(request):
    try:
        email = request.query_params.get("email")
        if not email:
            return Response({"message": "email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        transactions = Transaction.objects(Q(client_email=email) | Q(freelancer_email=email)).order_by("-created_at")
        serialized = [serialize_transaction(tx) for tx in transactions]

        return Response(serialized, status=status.HTTP_200_OK)

    except Exception as e:
        print("GET USER TRANSACTIONS ERROR:", str(e))
        return Response({
            "message": "Internal Server Error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
