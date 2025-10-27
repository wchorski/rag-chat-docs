import { OllamaEmbeddingFunction } from "@chroma-core/ollama"
import { ChromaClient } from "chromadb"

const DB_HOST = process.env.DB_HOST
const DB_PORT = Number(process.env.DB_PORT)
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL
const OLLAMA_URL = process.env.OLLAMA_URL

export const client = new ChromaClient({ host: DB_HOST, port: DB_PORT })

export const dbGetOrCreateCollection = async (collectionName: string) => {
	const collection = await client.getOrCreateCollection({
		name: collectionName,
		// no embed = @chroma-core/default-embed
		embeddingFunction: new OllamaEmbeddingFunction({
			url: OLLAMA_URL,
			// TODO test between these 2 embed models - https://cookbook.chromadb.dev/integrations/ollama/embeddings/#ollama-embedding-models
			model: EMBEDDING_MODEL,
			// model: "all-minilm-l6-v2",
		}),
	})

	return collection
}

export const dbGetCollection = async (collectionName: string) => {
	const collection = await client.getCollection({
		name: collectionName,
		// no embed = @chroma-core/default-embed
		embeddingFunction: new OllamaEmbeddingFunction({
			url: OLLAMA_URL,
			// TODO test between these 2 embed models - https://cookbook.chromadb.dev/integrations/ollama/embeddings/#ollama-embedding-models
			model: EMBEDDING_MODEL,
			// model: "all-minilm-l6-v2",
		}),
	})

	return collection
}

export async function dbDeleteCollection(name: string) {
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
