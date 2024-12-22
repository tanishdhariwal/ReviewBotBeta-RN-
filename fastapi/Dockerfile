# Stage 1: Build Stage
FROM python:3.10-slim as build

# Set the working directory
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt first to leverage Docker caching
COPY requirements.txt .

# Create a virtual environment and install Python dependencies
RUN python -m venv /opt/venv && \
    /bin/bash -c "source /opt/venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt --no-cache-dir && \
    pip install torch torchvision torchaudio --no-cache-dir"

# Copy the application files
COPY . .

# Stage 2: Runtime Stage
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Set the working directory
WORKDIR /app

# Install Python runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the virtual environment and application files from the build stage
COPY --from=build /opt/venv /opt/venv
COPY --from=build /app /app

# Expose the application port
EXPOSE 8000

# Use the virtual environment to run the application
CMD ["/bin/bash", "-c", "source /opt/venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
