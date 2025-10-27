import type { FastifyPluginAsync } from "fastify"

interface IBody {}
interface IParams {}
interface IQuerystring {
	name: string
}
interface IReply {
	200: { success: true; hello: string }
	302: { url: string }
	"4xx": { error: string }
	"5xx": { error: string }
}

const hello: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get<{
		Body: IBody
		Params: IParams
		Querystring: IQuerystring
		Reply: IReply
	}>(
		"/hello",
		{
			schema: {
				// request needs to have a querystring with a `name` parameter
				querystring: {
					type: "object",
					properties: {
						name: { type: "string" },
					},
					required: ["name"],
				},
				// the response needs to be an object with an `hello` property of type 'string'
				response: {
					200: {
						type: "object",
						properties: {
							hello: { type: "string" },
						},
					},
				},
			},
		},
		async (request, reply) => {
			const envs = request.getEnvs()
			console.log(envs)
			try {
				const { name } = request.query
				if (!name)
					return reply.code(404).send({ error: "missing `name` in query" })

				return reply.code(200).send({ success: true, hello: name })
			} catch (error: any) {
				console.log(error)
				return reply.code(500).send({ error: error.toString() })
			}
		}
	)
	// fastify.route({
	// 	method: "GET",
	// 	url: "/hello",
	// 	schema: {
	// 		// request needs to have a querystring with a `name` parameter
	// 		querystring: {
	// 			type: "object",
	// 			properties: {
	// 				name: { type: "string" },
	// 			},
	// 			required: ["name"],
	// 		},
	// 		// the response needs to be an object with an `hello` property of type 'string'
	// 		response: {
	// 			200: {
	// 				type: "object",
	// 				properties: {
	// 					hello: { type: "string" },
	// 				},
	// 			},
	// 		},
	// 	},
	// 	// this function is executed for every request before the handler is executed
	// 	preHandler: async (request, reply) => {
	// 		// E.g. check authentication
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { name } = request.query
	// 		return { hello: name }
	// 	},
	// })
}

export default hello
