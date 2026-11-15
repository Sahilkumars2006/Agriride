from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Notification

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'username', 
            'first_name', 
            'last_name', 
            'phone', 
            'role', 
            'password', 
            'confirm_password'
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})

        # Disallow self-registering as ADMIN via public API
        role = attrs.get('role', User.Role.FARMER)
        if role == User.Role.ADMIN:
            raise serializers.ValidationError({"role": "Cannot self-register as an administrator."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    tokens = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('This user account is currently disabled.')
            attrs['user_instance'] = user
            return attrs
        raise serializers.ValidationError('Both email and password are required.')

    def get_tokens(self, obj):
        user = obj.get('user_instance')
        refresh = RefreshToken.for_user(user)
        # Custom claims in JWT token
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['username'] = user.username
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def get_user(self, obj):
        user = obj.get('user_instance')
        return {
            'id': str(user.id),
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'role': user.role,
            'address': user.address,
        }


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'username', 
            'first_name', 
            'last_name', 
            'phone', 
            'role', 
            'address', 
            'date_joined',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'email', 'role', 'date_joined', 'created_at', 'updated_at']


class UserBriefSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone', 'role']

    def get_full_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name if name else obj.username


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'title', 'message', 'created_at']

