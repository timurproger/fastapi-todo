FROM python:3.12

WORKDIR /app

# Копируем весь src целиком в /app/src
COPY ./src /app/src

# Копируем requirements.txt, если он в корне проекта
COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

# Рабочая директория для запуска — /app
WORKDIR /app

# Запускаем uvicorn, указывая app из src.main
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
