"use strict"

import type { FastifyInstance } from "fastify"
import { dogQuery } from "../utils/query.js"

interface IQuerystring {}
interface IBody {
	question: string
	n?: number
}

interface IHeaders {
	"h-Custom": string
}

interface IReply {
	200: { success: boolean }
	302: { url: string }
	"4xx": { error: string }
	"5xx": { error: string }
}

export default async function routes(
	fastify: FastifyInstance,
	options: Object
) {
	fastify.post<{
		Querystring: IQuerystring
		Headers: IHeaders
		Reply: IReply
		Body: IBody
	}>("/search", async (request, reply) => {
		try {
			const { question, n = 3 } = request.body

			if (!question) {
				return reply.code(400).send({ error: "Question is required" })
			}

			// console.log(`\n📥 Question: ${question}`)

			// Run the LangGraph workflow
			const result = await dogQuery(question, n)

			// console.log(`📤 Answer generated\n`)

			return result
		} catch (error) {
			console.error("Error processing query:", error)
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			return reply.code(500).send({ error: errorMessage })
		}
	})
}
