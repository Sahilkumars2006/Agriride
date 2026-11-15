from rest_framework import serializers
from .models import Category, Equipment, EquipmentImage
from apps.users.serializers import UserBriefSerializer

class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(source='equipment.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'count']


class EquipmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentImage
        fields = ['id', 'image_url', 'is_primary']


class EquipmentListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = serializers.SerializerMethodField()
    owner = UserBriefSerializer(read_only=True)

    class Meta:
        model = Equipment
        fields = [
            'id',
            'name',
            'brand',
            'model',
            'year',
            'power',
            'fuel_type',
            'category',
            'category_name',
            'price_per_hour',
            'price_per_day',
            'security_deposit',
            'location',
            'state',
            'available',
            'operator_included',
            'rating',
            'reviews_count',
            'featured',
            'images',
            'owner',
            'created_at'
        ]

    def get_images(self, obj):
        return [img.image_url for img in obj.images.all()]


class EquipmentDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = serializers.SerializerMethodField()
    owner = UserBriefSerializer(read_only=True)

    class Meta:
        model = Equipment
        fields = [
            'id',
            'name',
            'brand',
            'model',
            'year',
            'power',
            'fuel_type',
            'category',
            'category_name',
            'price_per_hour',
            'price_per_day',
            'security_deposit',
            'location',
            'state',
            'latitude',
            'longitude',
            'available',
            'operator_included',
            'fuel_policy',
            'description',
            'specs',
            'rating',
            'reviews_count',
            'featured',
            'is_active',
            'images',
            'owner',
            'created_at',
            'updated_at'
        ]

    def get_images(self, obj):
        return [img.image_url for img in obj.images.all()]


class EquipmentCreateUpdateSerializer(serializers.ModelSerializer):
    image_urls = serializers.ListField(
        child=serializers.URLField(max_length=1000),
        write_only=True,
        required=False
    )

    class Meta:
        model = Equipment
        fields = [
            'id',
            'category',
            'name',
            'brand',
            'model',
            'year',
            'power',
            'fuel_type',
            'price_per_hour',
            'price_per_day',
            'security_deposit',
            'location',
            'state',
            'latitude',
            'longitude',
            'available',
            'operator_included',
            'fuel_policy',
            'description',
            'specs',
            'image_urls'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        image_urls = validated_data.pop('image_urls', [])
        request = self.context.get('request')
        validated_data['owner'] = request.user

        equipment = Equipment.objects.create(**validated_data)

        # Create images
        if image_urls:
            for idx, url in enumerate(image_urls):
                EquipmentImage.objects.create(
                    equipment=equipment,
                    image_url=url,
                    is_primary=(idx == 0)
                )
        else:
            # Default fallback image
            EquipmentImage.objects.create(
                equipment=equipment,
                image_url='https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
                is_primary=True
            )

        return equipment

    def update(self, instance, validated_data):
        image_urls = validated_data.pop('image_urls', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if image_urls is not None:
            instance.images.all().delete()
            for idx, url in enumerate(image_urls):
                EquipmentImage.objects.create(
                    equipment=instance,
                    image_url=url,
                    is_primary=(idx == 0)
                )

        return instance
