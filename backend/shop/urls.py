"""
SampiSilver API URLs.
"""
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from . import views

urlpatterns = [
    path('health/', views.health),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('categories/', views.CategoryListAPIView.as_view()),
    path('products/', views.ProductListAPIView.as_view()),
    path('products/<slug:slug>/', views.ProductDetailAPIView.as_view()),
    path('products/<slug:slug>/related/', views.ProductRelatedAPIView.as_view()),
    path('products/<slug:slug>/reviews/', views.ProductReviewsAPIView.as_view()),
    path('orders/', views.OrderCreateAPIView.as_view()),
    path('site-settings/', views.SiteSettingsAPIView.as_view()),
]
