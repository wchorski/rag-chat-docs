import { OllamaEmbeddingFunction } from "@chroma-core/ollama"
import { ChromaClient } from "chromadb"

export const client = new ChromaClient({ host: "localhost", port: 8000 })

export const getOrCreateCollection = async (collectionName: string) => {
	const collection = await client.getOrCreateCollection({
		name: collectionName,
		// no embed = @chroma-core/default-embed
		embeddingFunction: new OllamaEmbeddingFunction({
			url: "http://localhost:11434/",
			// TODO test between these 2 embed models - https://cookbook.chromadb.dev/integrations/ollama/embeddings/#ollama-embedding-models
			model: "nomic-embed-text",
			// model: "all-minilm-l6-v2",
		}),
	})

	return collection
}

export const getCollection = async (collectionName: string) => {
	const collection = await client.getCollection({
		name: collectionName,
		// no embed = @chroma-core/default-embed
		embeddingFunction: new OllamaEmbeddingFunction({
			url: "http://localhost:11434/",
			// TODO test between these 2 embed models - https://cookbook.chromadb.dev/integrations/ollama/embeddings/#ollama-embedding-models
			model: "nomic-embed-text",
			// model: "all-minilm-l6-v2",
		}),
	})

	return collection
}

export async function deleteCollection(name: string) {
	await client.deleteCollection({ name })
}

export async function dbListAllCollections() {
	try {
		const collections = await client.listCollections()
		console.log({ collections })
	} catch (error) {
		console.log(error)
	}
}
