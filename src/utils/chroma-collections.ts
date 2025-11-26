import { OllamaEmbeddingFunction } from "@chroma-core/ollama"
import { ChromaClient } from "chromadb"

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 8000
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL
const LLM_PROTOCOL = process.env.LLM_PROTOCOL || "http://"
const LLM_DOMAIN = process.env.LLM_DOMAIN || "locahost"
const LLM_PORT = process.env.LLM_PORT || "11434"
const LLM_URL = LLM_PROTOCOL + "://" + LLM_DOMAIN + ":" + LLM_PORT

export const client = new ChromaClient({ host: DB_HOST, port: DB_PORT })

export const dbGetOrCreateCollection = async (collectionName: string) => {
	console.log({ DB_HOST, DB_PORT, LLM_URL })
	const collection = await client.getOrCreateCollection({
		name: collectionName,
		// no embed = @chroma-core/default-embed
		embeddingFunction: new OllamaEmbeddingFunction({
			url: LLM_URL,
			// TODO test between these 2 embed models - https://cookbook.chromadb.dev/integrations/ollama/embeddings/#ollama-embedding-models
			model: EMBEDDING_MODEL,
			// model: "all-minilm-l6-v2",
		}),
	})

	return collection
}

export const dbGetCollection = async (collectionName: string) => {
  console.log({ DB_HOST, DB_PORT, LLM_URL })
	const collection = await client.getCollection({
		name: collectionName,
		// no embed = @chroma-core/default-embed
		embeddingFunction: new OllamaEmbeddingFunction({
			url: LLM_URL,
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
