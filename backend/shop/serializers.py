"""
SampiSilver API serializers.
"""
from rest_framework import serializers
from .models import (
    Category, Product, ProductImage, ProductVariant,
    Review, Order, OrderItem, SiteSettings
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'is_active']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'sort_order', 'is_main']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'sku', 'price_override', 'stock']


class ProductListSerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'price', 'old_price', 'currency',
            'in_stock', 'category', 'category_name', 'main_image', 'created_at'
        ]

    def get_main_image(self, obj):
        request = self.context.get('request')
        main = obj.images.filter(is_main=True).first()
        if main and main.image:
            url = main.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        first = obj.images.order_by('sort_order').first()
        if first and first.image:
            url = first.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'price', 'old_price',
            'currency', 'in_stock', 'category', 'category_name', 'attributes',
            'images', 'variants', 'average_rating', 'reviews_count', 'created_at'
        ]

    def get_average_rating(self, obj):
        from django.db.models import Avg
        result = obj.reviews.filter(is_approved=True).aggregate(Avg('rating'))
        avg = result.get('rating__avg')
        return round(avg, 1) if avg else None

    def get_reviews_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'author_name', 'rating', 'text', 'created_at']
        read_only_fields = ['created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['author_name', 'rating', 'text']

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Рейтинг должен быть от 1 до 5')
        return value


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    qty = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)
    customer_name = serializers.CharField(required=False, allow_blank=True)
    language = serializers.CharField(required=False, allow_blank=True, max_length=5)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Список товаров не может быть пустым')
        return value


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'telegram_username',
            'contact_text_ru', 'contact_text_uz',
            'about_text_ru', 'about_text_uz',
            'delivery_text_ru', 'delivery_text_uz',
            'care_text_ru', 'care_text_uz',
        ]
