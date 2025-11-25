"use strict"

import type { FastifyPluginAsync } from "fastify"
import { dbGetCollection } from "../../utils/chroma-collections"
import type { Collection } from "chromadb"

interface IParams {
	collection: string
}

interface IReply {
	200: { success: true; name: string; collection: Collection; count: number }
	302: { url: string }
	"4xx": { error: string }
	"5xx": { error: string }
}

const stats: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get<{ Params: IParams; Reply: IReply }>(
		"/stats/:collection",
		async (request, reply) => {
			try {
				const { collection } = request.params
				const dbCollection = await dbGetCollection(collection)
				const count = await dbCollection.count()

				return reply.code(200).send({
					success: true,
					// chromaUrl: CHROMA_URL,
					// ollamaUrl: OLLAMA_URL,
					count,
					name: collection,
					collection: dbCollection,
				})
			} catch (error) {
				fastify.log.error(error)
				return reply.code(500).send({
					error: (error as Error).message,
				})
			}
		}
	)

	// fastify.get("/stats", async (reply) => {
	// 	return reply
	// 		.code(200)
	// 		.send({
	// 			message:
	// 				'append a database name to check status, ex: "/api/stats/dogs"',
	// 		})
	// })
}

export default stats
