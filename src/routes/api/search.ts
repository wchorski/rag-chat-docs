"use strict"
import type { FastifyPluginAsync } from "fastify"
import { dbQuery } from "../../utils/query"
import type { Metadata, QueryResult } from "chromadb"

interface IQuerystring {}
interface IBody {
	collection: string
	question: string
	n?: number
}

interface IHeaders {
	"h-Custom": string
}

interface IReply {
	200: QueryResult<Metadata>
	302: { url: string }
	"4xx": { error: string }
	"5xx": { error: string }
}

const search: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.post<{
		Querystring: IQuerystring
		Headers: IHeaders
		Reply: IReply
		Body: IBody 
	}>("/search", async (request, reply) => {
		try {
			const { collection, question, n = 7 } = request.body

			if (!question) {
				return reply.code(400).send({ error: "Question is required" })
			}
			if (!collection) {
				return reply.code(400).send({ error: "Collection Name is required" })
			}

			// console.log(`\n📥 Question: ${question}`)

			// Run the LangGraph workflow
			const result = await dbQuery(collection, question, n)

			// console.log(`📤 Answer generated\n`)

			return reply.code(200).send(result)
		} catch (error) {
			console.error("Error processing query:", error)
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			return reply.code(500).send({ error: errorMessage })
		}
	})
}

export default search

// export default async function route(
// 	fastify: FastifyInstance,
// 	_options: Object
// ) {
// 	fastify.post<{
// 		Querystring: IQuerystring
// 		Headers: IHeaders
// 		Reply: IReply
// 		Body: IBody
// 	}>("/search", async (req: FastifyRequest, reply: FastifyReply) => {
// 		try {
// 			const { collection, question, n = 5 } = req.body

// 			if (!question) {
// 				return reply.code(400).send({ error: "Question is required" })
// 			}
// 			if (!collection) {
// 				return reply.code(400).send({ error: "Collection Name is required" })
// 			}

// 			// console.log(`\n📥 Question: ${question}`)

// 			// Run the LangGraph workflow
// 			const result = await dbQuery(collection, question, n)

// 			// console.log(`📤 Answer generated\n`)

// 			return result
// 		} catch (error) {
// 			console.error("Error processing query:", error)
// 			const errorMessage =
// 				error instanceof Error ? error.message : "Unknown error"
// 			return reply.code(500).send({ error: errorMessage })
// 		}
// 	})
// }
