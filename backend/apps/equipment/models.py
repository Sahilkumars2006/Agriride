import uuid
from django.db import models
from django.conf import settings

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # slug id e.g. 'tractors'
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, default='Tractor')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Equipment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='equipment_listings'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='equipment'
    )
    name = models.CharField(max_length=200, db_index=True)
    brand = models.CharField(max_length=100, db_index=True)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField(default=2023)
    power = models.CharField(max_length=100, default='50 HP')
    fuel_type = models.CharField(max_length=50, default='Diesel')

    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)

    location = models.CharField(max_length=200, db_index=True)
    state = models.CharField(max_length=100, db_index=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    available = models.BooleanField(default=True, db_index=True)
    operator_included = models.BooleanField(default=False)
    fuel_policy = models.CharField(max_length=150, default='Delivered Full (Return Full)')
    description = models.TextField()
    specs = models.JSONField(default=dict, blank=True)

    rating = models.FloatField(default=5.0)
    reviews_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - ₹{self.price_per_hour}/hr ({self.location})"


class EquipmentImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_url = models.URLField(max_length=1000)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', 'created_at']

    def __str__(self):
        return f"Image for {self.equipment.name}"


class Wishlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist_items'
    )
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('farmer', 'equipment')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.farmer.email} favorited {self.equipment.name}"
