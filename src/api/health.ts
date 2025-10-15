"use strict"

import { getCollection } from "../utils/chroma-collections.js"

module.exports = async function (fastify, opts) {
	fastify.get("/health", async () => {
		try {
			const collection = await getCollection("dogs")
			const count = await collection.count()

			return {
				status: "healthy",
				// chromaUrl: CHROMA_URL,
				// ollamaUrl: OLLAMA_URL,
				documentsCount: count,
			}
		} catch (error) {
			fastify.log.error(error)
			return {
				status: "unhealthy",
				error: (error as Error).message,
			}
		}
	})
}
