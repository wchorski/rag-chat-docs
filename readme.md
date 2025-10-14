# RAG MVP Application

A minimal viable RAG (Retrieval-Augmented Generation) application using LangGraph, Fastify, Ollama, and ChromaDB.

## Prerequisites

- Node.js 18+
- ChromaDB running on `localhost:8000`
- Ollama running on `localhost:11434`
- Ollama model: `llama3.2`

## Installation

```bash
npm install
```

The project uses TypeScript with `tsx` for development and can be compiled to JavaScript for production.

## Setup

1. Create a `docs` directory and add your markdown files:

```bash
mkdir docs
# Add your .md files to the docs/ directory
```

2. Pull required Ollama model:

```bash
ollama pull llama3.2
```

## Usage

### Step 1: Ingest Documents

Process and embed your markdown documents:

```bash
npm run ingest
```

This will:

- Read all `.md` files from the `docs/` directory
- Split them into chunks
- Store them in ChromaDB (embeddings generated automatically by ChromaDB's default embedding function)

### Step 2: Start the API Server

For development (with auto-reload):

```bash
npm run dev
```

Or for production:

```bash
npm start
```

Or build and run compiled JavaScript:

```bash
npm run build
npm run serve
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check

```bash
curl http://localhost:3000/health
```

### Query

```bash
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic of the documentation?"}'
```

Response:

```json
{
	"question": "What is the main topic of the documentation?",
	"answer": "Based on the context provided...",
	"context": "Retrieved document chunks..."
}
```

## Project Structure

```
.
├── docs/              # Your markdown documents
├── src/
│   ├── server.ts      # Fastify API server
│   ├── graph.ts       # LangGraph workflow
│   └── ingest.ts      # Document ingestion script
├── tsconfig.json      # TypeScript configuration
└── package.json
```

## How It Works

1. **Ingestion**: Documents are chunked and stored in ChromaDB with automatic embeddings
2. **Retrieval**: User questions are automatically embedded by ChromaDB and similar chunks are retrieved
3. **Generation**: LangGraph orchestrates the RAG workflow:
   - `retrieve` node: Fetches relevant context from ChromaDB using `queryTexts`
   - `generate` node: Uses Ollama LLM to generate answers based on context

## Configuration

You can modify these constants in the code:

- `CHROMA_URL`: ChromaDB endpoint (default: `http://localhost:8000`)
- `OLLAMA_URL`: Ollama endpoint (default: `http://localhost:11434`)
- `COLLECTION_NAME`: ChromaDB collection name (default: `docs`)
- Embedding: ChromaDB default embedding function (all-MiniLM-L6-v2)
- LLM model: `llama3.2`
- Chunk size: 1000 characters
- Chunk overlap: 200 characters
- Number of retrieved chunks: 3

## Chat examples

### Dogs Collection

```json
{
	"question": "what is the shortest dog breed?"
}
```

## API

- `/search` **fast** simple vector search that only returns relevant documents
- `/chat` **slow** pulls context from database and processes a natural language response

## Database & LLM
are deployed with seperate docker containers