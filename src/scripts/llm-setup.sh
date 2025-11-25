#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    set -a
    source .env
    set +a
else
    echo "Error: .env file not found"
    exit 1
fi

echo "Waiting for Ollama to be ready..."
sleep 5

echo "Pulling $OLLAMA_CHAT_MODEL language model..."
docker exec rag-chat-llm ollama pull $OLLAMA_CHAT_MODEL

echo "Pulling $EMBEDDING_MODEL embedding model..."
docker exec rag-chat-llm ollama pull $EMBEDDING_MODEL

echo "Models pulled successfully!"

echo "Available models:"
docker exec rag-chat-llm ollama list