"use strict"

import { FastifyInstance } from "fastify"
import { getCollection } from "../utils/chroma-collections.js"

module.exports = async function (fastify: FastifyInstance, _opts:Object) {
	fastify.get("/health/:collection", async (request, _reply) => {
		try {
      const { collection } = request.params
			const dbCollection = await getCollection(collection)
			const count = await dbCollection.count()

			return {
				status: "healthy",
				// chromaUrl: CHROMA_URL,
				// ollamaUrl: OLLAMA_URL,
        collection,
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
