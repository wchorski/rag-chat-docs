"use strict"

import type { FastifyInstance } from "fastify"
import { app } from "../utils/graph.js"

// // Request body type
type QueryRequest = {
	body: {
		question: string
		collection: string
	}
}

export default async function route(
	fastify: FastifyInstance,
	_options: Object
) {
	fastify.post("/chat", async (request: QueryRequest, reply) => {
		try {
      
			const { question, collection } = request.body

			if (!question) {
				return reply.code(400).send({ error: "Question is required" })
			}
			if (!collection) {
				return reply.code(400).send({ error: "collection is required" })
			}

			// console.log(`\n📥 Question: ${question}`)

			// Run the LangGraph workflow
			const result = await app.invoke({
        collection,
				question,
				context: null,
				answer: null,
			})

			// console.log(`📤 Answer generated\n`)

			return {
				question: result.question,
				answer: result.answer,
				context: result.context,
			}
		} catch (error) {
			console.error("Error processing query:", error)
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			return reply.code(500).send({ error: errorMessage })
		}
	})
}
