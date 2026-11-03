# CourseIQ - Production Backend Dockerfile
# Python 3.11 slim base image for optimal machine learning compatibility and small image size
FROM python:3.11-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    NLTK_DATA=/usr/share/nltk_data \
    PORT=5000 \
    DATA_DIR=/app/data

WORKDIR /app

# Install minimal OS dependencies for health checking
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first to maximize Docker layer caching
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Pre-download required NLTK datasets so container startup is instant and fully offline-capable
RUN mkdir -p /usr/share/nltk_data && \
    python -m nltk.downloader -d /usr/share/nltk_data stopwords wordnet omw-1.4

# Copy pre-trained ML models (vectorizer, tfidf_matrix, similarity_matrix, courses_df)
COPY model/ /app/model/

# Copy initial dataset and storage files
COPY data/ /app/data/

# Copy Flask backend application code and templates
COPY app.py /app/app.py
COPY model.py /app/model.py
COPY recommender.py /app/recommender.py
COPY preprocessing.py /app/preprocessing.py
COPY chatbot_prompt.py /app/chatbot_prompt.py
COPY courseiq_kb.py /app/courseiq_kb.py
COPY educational_engine.py /app/educational_engine.py
COPY openai_service.py /app/openai_service.py
COPY templates/ /app/templates/

# Ensure data directory exists for persistent named volume mounting
RUN mkdir -p /app/data

EXPOSE 5000

# Container healthcheck using dedicated /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Production Gunicorn WSGI server binding to all interfaces
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "4", "--timeout", "120", "app:app"]

