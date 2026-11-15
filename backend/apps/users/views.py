from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Notification
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserProfileSerializer,
    NotificationSerializer
)
from .permissions import IsAdminUserRole

class RegisterView(APIView):
    """
    POST /api/v1/auth/register/
    Register a new Farmer or Equipment Owner account.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            refresh['email'] = user.email
            refresh['role'] = user.role
            refresh['username'] = user.username

            return Response({
                'message': 'Account registered successfully.',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'phone': user.phone,
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/v1/auth/login/
    Authenticate with email and password to receive JWT tokens and role info.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            tokens = serializer.get_tokens(serializer.validated_data)
            user_data = serializer.get_user(serializer.validated_data)
            return Response({
                'message': 'Login successful.',
                'tokens': tokens,
                'user': user_data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/v1/auth/me/
    PATCH /api/v1/auth/profile/
    Retrieve or update the authenticated user's profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AdminUserListView(generics.ListAPIView):
    """
    GET /api/v1/admin/users/
    Admin endpoint to view and search all registered farmers and equipment owners.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        queryset = User.objects.all().order_by('-date_joined')
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role.upper())
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(email__icontains=search) | queryset.filter(username__icontains=search)
        return queryset


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """
    PATCH /api/v1/admin/users/<uuid:pk>/
    Admin endpoint to view or update status of a user (e.g., deactivate account).
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUserRole]
    queryset = User.objects.all()


class NotificationListView(generics.ListAPIView):
    """GET /api/v1/notifications/"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)[:20]


class NotificationMarkReadView(APIView):
    """PATCH /api/v1/notifications/<uuid:pk>/read/"""
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
            notif.is_read = True
            notif.save()
            return Response({"message": "Marked as read."})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)


class NotificationMarkAllReadView(APIView):
    """POST /api/v1/notifications/mark-all-read/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read."})
