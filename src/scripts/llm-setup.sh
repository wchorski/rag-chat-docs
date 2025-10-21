#!/bin/bash

echo "Waiting for Ollama to be ready..."
sleep 5

echo "Pulling Llama 3.2 model..."
docker exec chatrag-llm ollama pull llama3.2

echo "Pulling all-minilm embedding model..."
docker exec chatrag-llm ollama pull all-minilm

echo "Models pulled successfully!"

echo "Available models:"
docker exec chatrag-llm ollama list