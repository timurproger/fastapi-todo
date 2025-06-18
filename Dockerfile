FROM python:3.12

WORKDIR /app

# Копируем содержимое src в корень /app
COPY ./src/ /app/

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
