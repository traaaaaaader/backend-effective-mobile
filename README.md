# Установка

---

Скачать репозиторий

```
git clone https://github.com/traaaaaaader/backend-effective-mobile.git
```

## Переменные окружения

В корневой папке находится файл `.env` со следующими переменными:

```env
PORT=4000

DB_HOST=user_db
DB_PORT=5432
DB_NAME=user_db
DB_USER=admin
DB_PASSWORD=admin

DB_URL="postgresql://admin:admin@user_db:5432/user_db"

JWT_SECRET="secret"
JWT_EXPIRES_IN="7d"

BCRYPT_ROUNDS=10
```

## Установка и запуск

1. Перейти в папку проекта

```
cd backend-effective-mobile
```

2. собрать и запустить контейнеры

```
docker-compose up -d
```

3. Сделать миграции

```
docker-compose -f docker-compose.migrate.yaml up -d
```
