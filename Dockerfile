# Используем базовый образ Python
FROM python:3.12-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-distutils \
    python3-pip \
    && apt-get clean

# Установка pipenv и зависимостей
RUN pip install --upgrade pip

# Копирование зависимостей проекта
COPY requirements.txt /app/requirements.txt

# Установка зависимостей проекта
RUN pip install -r /app/requirements.txt

# Копирование кода проекта
COPY . /app

# Установка рабочей директории
WORKDIR /app

# Команда запуска приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "devsearch.wsgi:application"]
