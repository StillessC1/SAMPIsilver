"""
Django Admin configuration for SampiSilver.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category, Product, ProductImage, ProductVariant,
    Review, Order, OrderItem, SiteSettings
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active']
    list_filter = ['is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ['image', 'image_preview', 'sort_order', 'is_main']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj and obj.pk and obj.image:
            try:
                return format_html(
                    '<img src="{}" style="max-height: 80px; max-width: 120px;" alt="" />',
                    obj.image.url
                )
            except (ValueError, OSError):
                pass
        return '-'

    image_preview.short_description = 'Превью'


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = ['name', 'sku', 'price_override', 'stock']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'category', 'price', 'in_stock', 'created_at']
    list_filter = ['category', 'in_stock', 'created_at']
    search_fields = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['id', 'created_at']
    inlines = [ProductImageInline, ProductVariantInline]
    fieldsets = (
        (None, {
            'fields': ('id', 'name', 'slug', 'sku', 'description', 'category')
        }),
        ('Цены', {
            'fields': ('price', 'old_price', 'currency', 'in_stock')
        }),
        ('Атрибуты', {
            'fields': ('attributes',),
            'classes': ('collapse',)
        }),
        ('Даты', {
            'fields': ('created_at',)
        }),
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author_name', 'product', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'rating']
    search_fields = ['author_name', 'text', 'product__name']
    actions = ['approve_reviews']

    @admin.action(description='Одобрить выбранные отзывы')
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name_snapshot', 'sku_snapshot', 'variant_name', 'price_at_purchase', 'qty']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'status', 'customer_name', 'total_amount']
    list_filter = ['status', 'created_at']
    search_fields = ['customer_name']
    readonly_fields = ['created_at']
    inlines = [OrderItemInline]
    actions = ['set_confirmed', 'set_shipped', 'set_done', 'set_canceled']

    @admin.action(description='Подтвердить заказы')
    def set_confirmed(self, request, queryset):
        queryset.update(status='confirmed')

    @admin.action(description='Отправить заказы')
    def set_shipped(self, request, queryset):
        queryset.update(status='shipped')

    @admin.action(description='Выполнить заказы')
    def set_done(self, request, queryset):
        queryset.update(status='done')

    @admin.action(description='Отменить заказы')
    def set_canceled(self, request, queryset):
        queryset.update(status='canceled')


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Telegram', {
            'fields': ('telegram_username',)
        }),
        ('Контакты', {
            'fields': ('contact_text_ru', 'contact_text_uz')
        }),
        ('О нас', {
            'fields': ('about_text_ru', 'about_text_uz')
        }),
        ('Доставка и оплата', {
            'fields': ('delivery_text_ru', 'delivery_text_uz')
        }),
        ('Уход за серебром', {
            'fields': ('care_text_ru', 'care_text_uz')
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
