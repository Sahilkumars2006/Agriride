from rest_framework import permissions

class IsFarmer(permissions.BasePermission):
    """Allows access only to authenticated users with FARMER role."""
    message = "Access restricted to Farmer accounts."

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'FARMER'
        )


class IsEquipmentOwner(permissions.BasePermission):
    """Allows access only to authenticated users with OWNER role."""
    message = "Access restricted to Equipment Owner accounts."

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'OWNER'
        )


class IsAdminUserRole(permissions.BasePermission):
    """Allows access only to authenticated users with ADMIN role or staff permissions."""
    message = "Access restricted to Platform Administrators."

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser)
        )


class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object or admins to edit it."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Object must have an `owner` or `user` attribute
        owner = getattr(obj, 'owner', getattr(obj, 'user', None))
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (owner == request.user or request.user.role == 'ADMIN' or request.user.is_staff)
        )
