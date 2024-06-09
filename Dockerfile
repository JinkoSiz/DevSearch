FROM python:3.12-slim

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    build-essential \
    setuptools

# Установка зависимостей
COPY requirements.txt .
RUN pip install -r requirements.txt

# Копирование проекта
COPY . /app

# Установка рабочей директории
WORKDIR /app

# Команда запуска приложения
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
