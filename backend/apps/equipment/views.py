from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Equipment
from .serializers import (
    CategorySerializer,
    EquipmentListSerializer,
    EquipmentDetailSerializer,
    EquipmentCreateUpdateSerializer
)
from apps.users.permissions import IsEquipmentOwner, IsAdminUserRole, IsOwnerOrAdminOrReadOnly

class CategoryListView(generics.ListAPIView):
    """GET /api/v1/categories/"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class EquipmentListView(generics.ListAPIView):
    """
    GET /api/v1/equipment/
    Public listing with multi-parameter filtering: category, state, search, price, available.
    """
    serializer_class = EquipmentListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Equipment.objects.filter(is_active=True).select_related('category', 'owner').prefetch_related('images')

        # Filter by Category
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category_id=category)

        # Filter by State
        state = self.request.query_params.get('state')
        if state and state != 'All States':
            queryset = queryset.filter(state__iexact=state)

        # Filter by Search term
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(brand__icontains=search) |
                Q(model__icontains=search) |
                Q(location__icontains=search) |
                Q(description__icontains=search)
            )

        # Filter by Max Hourly Price
        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price_per_hour__lte=float(max_price))
            except ValueError:
                pass

        # Filter by Availability
        only_available = self.request.query_params.get('available')
        if only_available in ('true', '1', 'True'):
            queryset = queryset.filter(available=True)

        # Filter by Operator Included
        operator_only = self.request.query_params.get('operator_included')
        if operator_only in ('true', '1', 'True'):
            queryset = queryset.filter(operator_included=True)

        # Sort Order
        sort_by = self.request.query_params.get('sort_by', 'featured')
        if sort_by == 'price-asc':
            queryset = queryset.order_by('price_per_hour')
        elif sort_by == 'price-desc':
            queryset = queryset.order_by('-price_per_hour')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')
        else:
            queryset = queryset.order_by('-featured', '-created_at')

        return queryset


class EquipmentDetailView(generics.RetrieveAPIView):
    """GET /api/v1/equipment/<uuid:pk>/"""
    queryset = Equipment.objects.filter(is_active=True).select_related('category', 'owner').prefetch_related('images')
    serializer_class = EquipmentDetailSerializer
    permission_classes = [permissions.AllowAny]


class EquipmentCreateView(generics.CreateAPIView):
    """
    POST /api/v1/equipment/
    Add a new machinery listing. Restricted to Equipment Owners or Admins.
    """
    serializer_class = EquipmentCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Enforce that user must be OWNER or ADMIN
        if self.request.user.role not in ('OWNER', 'ADMIN'):
            raise permissions.PermissionDenied("Only Equipment Owners can list machinery.")
        serializer.save(owner=self.request.user)


class EquipmentUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    PATCH / DELETE /api/v1/equipment/<uuid:pk>/
    Update or delete machinery listing. Restricted to the owner of this machine or Admin.
    """
    queryset = Equipment.objects.all()
    serializer_class = EquipmentCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdminOrReadOnly]

    def perform_destroy(self, instance):
        # Soft-delete by marking inactive
        instance.is_active = False
        instance.save()


class OwnerFleetListView(generics.ListAPIView):
    """
    GET /api/v1/equipment/my-fleet/
    Retrieve all machinery listed by the authenticated owner.
    """
    serializer_class = EquipmentListSerializer
    permission_classes = [permissions.IsAuthenticated, IsEquipmentOwner]
    pagination_class = None

    def get_queryset(self):
        return Equipment.objects.filter(owner=self.request.user, is_active=True).prefetch_related('images')
