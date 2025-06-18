FROM python:3.12

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все из папки src в /app внутри контейнера
COPY ./src /app

# Запуск Uvicorn с правильным импортом
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
