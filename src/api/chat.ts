"use strict"

import { app } from "../utils/graph.js"


// // Request body type
// interface QueryRequest {
// 	question: string
// }

module.exports = async function (fastify, opts) {
	fastify.post("/chat", async (request, reply) => {
		try {
			const { question } = request.body

			if (!question) {
				return reply.code(400).send({ error: "Question is required" })
			}

			// console.log(`\n📥 Question: ${question}`)

			// Run the LangGraph workflow
			const result = await app.invoke({
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
