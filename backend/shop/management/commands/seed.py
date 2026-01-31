"""
Seed data for SampiSilver.
"""
import os
import uuid
from decimal import Decimal
from io import BytesIO
from django.core.management.base import BaseCommand
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.text import slugify
from shop.models import Category, Product, ProductImage, ProductVariant, Review, SiteSettings


class Command(BaseCommand):
    help = 'Seed categories, products, reviews and site settings'

    def handle(self, *args, **options):
        self.stdout.write('Seeding...')

        # Categories
        categories_data = [
            ('Кольца', 'koltsa'),
            ('Браслеты', 'braslety'),
            ('Комплекты', 'komplekty'),
            ('Цепочки', 'tsepochki'),
        ]
        categories = {}
        for name, slug in categories_data:
            cat, _ = Category.objects.get_or_create(slug=slug, defaults={'name': name, 'is_active': True})
            categories[slug] = cat

        # Products
        products_data = [
            ('Серебряное кольцо с фианитом', 'koltsa', 'SS-R-001', Decimal('850000'), Decimal('950000'),
             'Элегантное серебряное кольцо 925 пробы с вставкой из фианита.', {'проба': '925', 'вес': '3.2г'}),
            ('Кольцо-печатка классическое', 'koltsa', 'SS-R-002', Decimal('620000'), None,
             'Классическое серебряное кольцо-печатка 925 пробы.', {'проба': '925', 'вес': '4.5г'}),
            ('Кольцо с чернением', 'koltsa', 'SS-R-003', Decimal('780000'), Decimal('880000'),
             'Серебряное кольцо с художественным чернением.', {'проба': '925', 'вес': '3.8г'}),
            ('Браслет плетение Бисмарк', 'braslety', 'SS-B-001', Decimal('1200000'), None,
             'Массивный серебряный браслет плетения Бисмарк.', {'проба': '925', 'вес': '25г'}),
            ('Браслет-цепочка тонкий', 'braslety', 'SS-B-002', Decimal('450000'), Decimal('520000'),
             'Изящный тонкий браслет из серебра 925 пробы.', {'проба': '925', 'вес': '8г'}),
            ('Браслет с подвесками', 'braslety', 'SS-B-003', Decimal('950000'), None,
             'Серебряный браслет с подвесками в виде звёзд.', {'проба': '925', 'вес': '12г'}),
            ('Комплект кольцо + серьги', 'komplekty', 'SS-K-001', Decimal('1850000'), Decimal('2100000'),
             'Комплект из кольца и сережек с фианитами.', {'проба': '925', 'вес': '15г'}),
            ('Комплект браслет + кулон', 'komplekty', 'SS-K-002', Decimal('2200000'), None,
             'Комплект браслет и кулон в едином стиле.', {'проба': '925', 'вес': '35г'}),
            ('Цепочка панцирное плетение 45см', 'tsepochki', 'SS-C-001', Decimal('380000'), None,
             'Серебряная цепочка панцирного плетения длиной 45 см.', {'проба': '925', 'длина': '45см'}),
            ('Цепочка якорное плетение 55см', 'tsepochki', 'SS-C-002', Decimal('420000'), Decimal('480000'),
             'Серебряная цепочка якорного плетения длиной 55 см.', {'проба': '925', 'длина': '55см'}),
            ('Цепочка бисмарк 50см', 'tsepochki', 'SS-C-003', Decimal('650000'), None,
             'Массивная цепочка плетения Бисмарк 50 см.', {'проба': '925', 'длина': '50см'}),
            ('Кольцо минималистичное', 'koltsa', 'SS-R-004', Decimal('420000'), None,
             'Минималистичное серебряное кольцо 925 пробы.', {'проба': '925', 'вес': '2.1г'}),
        ]

        size_variants = [
            ('Размер 16', '16'),
            ('Размер 17', '17'),
            ('Размер 18', '18'),
            ('Размер 19', '19'),
        ]
        length_variants = [
            ('Длина 45см', '45'),
            ('Длина 50см', '50'),
            ('Длина 55см', '55'),
        ]

        def make_placeholder():
            try:
                from PIL import Image
                img = Image.new('RGB', (400, 400), color=(229, 231, 235))
                buf = BytesIO()
                img.save(buf, format='PNG')
                return SimpleUploadedFile('placeholder.png', buf.getvalue(), content_type='image/png')
            except ImportError:
                return None

        for i, (name, cat_slug, sku, price, old_price, desc, attrs) in enumerate(products_data):
            slug = slugify(name, allow_unicode=True)
            base_slug = slug
            c = 0
            while Product.objects.filter(slug=slug).exists():
                c += 1
                slug = f'{base_slug}-{c}'
            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults={
                    'id': uuid.uuid4(),
                    'name': name,
                    'slug': slug,
                    'description': desc,
                    'price': price,
                    'old_price': old_price,
                    'currency': 'UZS',
                    'in_stock': True,
                    'category': categories[cat_slug],
                    'attributes': attrs,
                }
            )
            if created:
                placeholder = make_placeholder()
                if placeholder:
                    ProductImage.objects.create(
                        product=product,
                        image=placeholder,
                        sort_order=0,
                        is_main=True,
                    )

            # Add variants for rings/bracelets (sizes) or chains (lengths)
            if 'koltsa' in cat_slug or 'braslety' in cat_slug:
                for vname, vsize in size_variants:
                    ProductVariant.objects.get_or_create(
                        product=product,
                        name=vname,
                        defaults={'sku': f'{sku}-{vsize}', 'stock': 2}
                    )
            elif 'tsepochki' in cat_slug:
                for vname, vlen in length_variants:
                    ProductVariant.objects.get_or_create(
                        product=product,
                        name=vname,
                        defaults={'sku': f'{sku}-{vlen}', 'stock': 3}
                    )
            else:
                ProductVariant.objects.get_or_create(
                    product=product,
                    name='Один размер',
                    defaults={'sku': f'{sku}-OS', 'stock': 1}
                )

        for product in Product.objects.all():
            if not product.images.exists():
                placeholder = make_placeholder()
                if placeholder:
                    ProductImage.objects.create(
                        product=product,
                        image=placeholder,
                        sort_order=0,
                        is_main=True,
                    )

        # Reviews
        reviews_data = [
            ('Анна', 5, 'Отличное качество! Очень довольна покупкой.'),
            ('Маргарита', 5, 'Красивое кольцо, носится с удовольствием.'),
            ('Диана', 4, 'Хороший браслет, доставили быстро.'),
            ('Елена', 5, 'Комплект превосходный, всем рекомендую!'),
            ('Ольга', 4, 'Цепочка качественная, цена адекватная.'),
            ('Наталья', 5, 'Серебро 925, всё как в описании. Спасибо!'),
        ]
        products_with_reviews = list(Product.objects.all()[:6])
        for i, (author, rating, text) in enumerate(reviews_data):
            product = products_with_reviews[i % len(products_with_reviews)]
            Review.objects.get_or_create(
                product=product,
                author_name=author,
                text=text,
                defaults={'rating': rating, 'is_approved': True}
            )

        # SiteSettings
        SiteSettings.objects.get_or_create(pk=1, defaults={
            'telegram_username': 'zxsvgh',
            'contact_text_ru': 'Свяжитесь с нами в Telegram для консультации и заказов.',
            'contact_text_uz': 'Konsultatsiya va buyurtmalar uchun Telegram orqali bog\'laning.',
            'about_text_ru': 'SampiSilver — магазин качественных серебряных украшений 925 пробы. Мы предлагаем кольца, браслеты, цепочки и комплекты для любого случая.',
            'about_text_uz': 'SampiSilver — 925 probali sifatli kumush zargarlik buyumlari do\'koni. Har qanday holat uchun uzuklar, bilaguzuklar, zanjirlar va to\'plamlarni taklif qilamiz.',
            'delivery_text_ru': 'Доставка по Узбекистану. Оплата наличными при получении или переводом. Срок доставки 2-5 рабочих дней.',
            'delivery_text_uz': 'O\'zbekiston bo\'ylab yetkazib berish. Qabul qilishda naqd pul yoki o\'tkazma orqali to\'lov. Yetkazib berish muddati 2-5 ish kuni.',
            'care_text_ru': 'Уход за серебром: храните в сухом месте, избегайте контакта с косметикой и бытовой химией. Чистите специальной салфеткой для серебра.',
            'care_text_uz': 'Kumushga g\'amxo\'rlik: quruq joyda saqlang, kosmetika va uy kimyoviy moddalari bilan aloqa qilmaslik. Maxsus kumush choyshab bilan tozalang.',
        })

        self.stdout.write(self.style.SUCCESS('Seed completed!'))
