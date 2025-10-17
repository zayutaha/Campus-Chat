# Base image
FROM ghcr.io/astral-sh/uv:alpine3.22

WORKDIR /app

COPY . .
RUN uv sync
RUN uv tool install uvicorn 

# Expose FastAPI port
EXPOSE 8000

# Run Uvicorn
CMD ["uv", "run", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

