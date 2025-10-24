"use strict"

import type { FastifyPluginAsync } from "fastify"
import { getCollection } from "../../utils/chroma-collections"
import type { Collection } from "chromadb"

interface IParams {
	collection: string
}

interface IReply {
	200: { status: "statsy"; collection: Collection; count: number }
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
				const dbCollection = await getCollection(collection)
				const count = await dbCollection.count()

				return reply.code(200).send({
					status: "statsy",
					// chromaUrl: CHROMA_URL,
					// ollamaUrl: OLLAMA_URL,
					collection: dbCollection,
					count,
				})
			} catch (error) {
				fastify.log.error(error)
				return {
					status: "unstatsy",
					error: (error as Error).message,
				}
			}
		}
	)

  fastify.get('/stats', async () => {
    return { message: 'append a database name to check status, ex: "/api/stats/dogs"' }
  })
}

export default stats

// module.exports = async function (fastify: FastifyInstance, _opts:Object) {
// 	fastify.get("/stats/:collection", async (request, _reply) => {
// 		try {
//       const { collection } = request.params
// 			const dbCollection = await getCollection(collection)
// 			const count = await dbCollection.count()

// 			return {
// 				status: "statsy",
// 				// chromaUrl: CHROMA_URL,
// 				// ollamaUrl: OLLAMA_URL,
//         collection,
// 				documentsCount: count,
// 			}
// 		} catch (error) {
// 			fastify.log.error(error)
// 			return {
// 				status: "unstatsy",
// 				error: (error as Error).message,
// 			}
// 		}
// 	})
// }
