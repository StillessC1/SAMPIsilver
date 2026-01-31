"""
SampiSilver API views.
"""
from decimal import Decimal
from django.db.models import Q, Avg
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Category, Product, Review, Order, OrderItem, SiteSettings
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ReviewSerializer,
    ReviewCreateSerializer,
    OrderCreateSerializer,
    SiteSettingsSerializer,
)


@extend_schema(tags=['Health'])
@api_view(['GET'])
def health(request):
    """Health check endpoint for deployment."""
    return Response({'status': 'ok'})


@extend_schema_view(get=extend_schema(tags=['Categories']))
class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    pagination_class = None  # категорий мало, пагинация не нужна


@extend_schema_view(get=extend_schema(tags=['Products']))
class ProductListAPIView(ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        qs = Product.objects.select_related('category').prefetch_related('images')
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(sku__icontains=search)
            )
        ordering = self.request.query_params.get('ordering', '-created_at')
        allowed = ['created_at', '-created_at', 'price', '-price', 'name', '-name']
        if ordering in allowed:
            qs = qs.order_by(ordering)
        return qs


@extend_schema_view(get=extend_schema(tags=['Products']))
class ProductDetailAPIView(RetrieveAPIView):
    queryset = Product.objects.select_related('category').prefetch_related(
        'images', 'variants'
    )
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


@extend_schema_view(get=extend_schema(tags=['Products']))
class ProductRelatedAPIView(APIView):
    def get(self, request, slug):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        qs = Product.objects.filter(
            category=product.category,
            in_stock=True
        ).exclude(pk=product.pk).prefetch_related('images')[:4]
        serializer = ProductListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


@extend_schema_view(
    get=extend_schema(tags=['Reviews']),
    post=extend_schema(tags=['Reviews'])
)
class ProductReviewsAPIView(APIView):
    def get(self, request, slug):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        reviews = product.reviews.filter(is_approved=True)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, slug):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema_view(post=extend_schema(tags=['Orders']))
class OrderCreateAPIView(APIView):
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = Order.objects.create(
            customer_name=data.get('customer_name', ''),
            language=data.get('language', ''),
            total_amount=Decimal('0'),
        )

        total = Decimal('0')
        for item_data in data['items']:
            try:
                product = Product.objects.prefetch_related('variants').get(
                    pk=item_data['product_id']
                )
            except Product.DoesNotExist:
                order.delete()
                return Response(
                    {'detail': f'Product {item_data["product_id"]} not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            variant = None
            variant_name = ''
            sku = product.sku
            price = product.price

            if item_data.get('variant_id'):
                variant = product.variants.filter(pk=item_data['variant_id']).first()
                if variant:
                    variant_name = variant.name
                    sku = variant.sku
                    if variant.price_override is not None:
                        price = variant.price_override

            qty = item_data['qty']
            item_total = price * qty
            total += item_total

            OrderItem.objects.create(
                order=order,
                product=product,
                variant_name=variant_name,
                product_name_snapshot=product.name,
                sku_snapshot=sku,
                price_at_purchase=price,
                qty=qty,
            )

        order.total_amount = total
        order.save()

        return Response(
            {'id': order.id, 'total_amount': str(order.total_amount), 'status': order.status},
            status=status.HTTP_201_CREATED
        )


@extend_schema_view(get=extend_schema(tags=['Site']))
class SiteSettingsAPIView(APIView):
    def get(self, request):
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)
