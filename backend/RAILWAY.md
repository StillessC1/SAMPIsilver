Краткая инструкция по деплою backend на Railway

1) В Railway создайте новый проект и в настройках укажите корневую директорию `backend` (или укажите Dockerfile-путь).
2) Добавьте PostgreSQL плагин (Railway создаст `DATABASE_URL`).
3) В настройках проекта добавьте переменные окружения:
   - `SECRET_KEY` — секретный ключ Django
   - `DEBUG` — `False` в проде
   - `ALLOWED_HOSTS` — например `localhost,127.0.0.1,.railway.app`
   - (опционально) `CLOUDINARY_URL` или `CLOUDINARY_*` для загрузки медиа
4) Railway будет билдить `backend/Dockerfile`. Dockerfile уже запускает `docker-entrypoint.sh`, который выполняет миграции и `collectstatic`.
5) Если вы используете Docker-less деплой, используйте `Procfile` (в `backend/Procfile`) — уже добавлен.

Дополнительно:
- Убедитесь, что в `requirements.txt` есть `gunicorn`, `dj-database-url` и `psycopg[binary]`.
- Проверьте, что `config/settings.py` поддерживает `DATABASE_URL` (уже реализовано).
- При первом деплое можно проверить логи сервиса Railway и выполнить rollback при ошибках.

Если хотите — могу автоматически создать в проекте `railway` плагин (через CLI) и задеплоить тестовый релиз — скажите, разрешаете ли подключаться к Railway (нужны токены и доступ).