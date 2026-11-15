from django.urls import path
from .views import (
    CategoryListView,
    EquipmentListView,
    EquipmentDetailView,
    EquipmentCreateView,
    EquipmentUpdateDeleteView,
    OwnerFleetListView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories-list'),
    path('equipment/', EquipmentListView.as_view(), name='equipment-list'),
    path('equipment/create/', EquipmentCreateView.as_view(), name='equipment-create'),
    path('equipment/my-fleet/', OwnerFleetListView.as_view(), name='owner-fleet-list'),
    path('equipment/<uuid:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),
    path('equipment/<uuid:pk>/update/', EquipmentUpdateDeleteView.as_view(), name='equipment-update-delete'),
]
