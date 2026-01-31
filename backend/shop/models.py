"""
SampiSilver shop models.
"""
import uuid
from decimal import Decimal
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Product category."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Product(models.Model):
    """Silver jewelry product."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    old_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='UZS')
    in_stock = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    attributes = models.JSONField(default=dict, blank=True)  # размер, проба, вес и т.д.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """Product image."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    sort_order = models.PositiveIntegerField(default=0)
    is_main = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'
        ordering = ['sort_order', 'id']

    def __str__(self):
        return f'{self.product.name} - {self.sort_order}'


class ProductVariant(models.Model):
    """Product variant (size, length, etc.)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100)  # "Размер 17" / "Длина 55см"
    sku = models.CharField(max_length=50, unique=True)
    price_override = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Вариант товара'
        verbose_name_plural = 'Варианты товаров'

    def __str__(self):
        return f'{self.product.name} - {self.name}'


class Review(models.Model):
    """Product review with moderation."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    author_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField()  # 1-5
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.author_name} - {self.product.name} ({self.rating})'


class Order(models.Model):
    """Customer order."""
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('confirmed', 'Подтверждён'),
        ('shipped', 'Отправлен'),
        ('done', 'Выполнен'),
        ('canceled', 'Отменён'),
    ]
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    customer_name = models.CharField(max_length=255, null=True, blank=True)
    language = models.CharField(max_length=5, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f'Заказ #{self.id} ({self.status})'


class OrderItem(models.Model):
    """Order item with product snapshot."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    variant_name = models.CharField(max_length=100, blank=True)
    product_name_snapshot = models.CharField(max_length=255)
    sku_snapshot = models.CharField(max_length=50)
    price_at_purchase = models.DecimalField(max_digits=12, decimal_places=2)
    qty = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказов'


class SiteSettings(models.Model):
    """Single-record site settings."""
    telegram_username = models.CharField(max_length=100, default='zxsvgh')
    contact_text_ru = models.TextField(blank=True)
    contact_text_uz = models.TextField(blank=True)
    about_text_ru = models.TextField(blank=True)
    about_text_uz = models.TextField(blank=True)
    delivery_text_ru = models.TextField(blank=True)
    delivery_text_uz = models.TextField(blank=True)
    care_text_ru = models.TextField(blank=True)
    care_text_uz = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Настройки сайта'
        verbose_name_plural = 'Настройки сайта'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
