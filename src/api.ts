import Fastify from "fastify"
import { fileURLToPath } from "node:url"
import path, { dirname } from "node:path"
import AutoLoad from "@fastify/autoload"
import { fastifyEnv } from "@fastify/env"
import { fastifyMultipart } from "@fastify/multipart"
import { fastifyCors } from "@fastify/cors"
import { fastifyStatic } from "@fastify/static"

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
// import { app } from "./graph.js"
// import { getCollection } from "./chroma-collections.js"
// import { dogQuery } from "./query.js"

// TODO tie this in with NODE_ENV?
const fastify = Fastify({
	logger: false,
})

// Pass --options via CLI arguments in command to enable these options.
const opts = {}

type Envs = {
	DB_USERNAME: string
	DB_PASSWORD: string
	DB_HOST: string
	DB_PORT: number
	OLLAMA_API: string
	EMBEDDING_MODEL: string
	PORT: number
	HOST: string
	WEB_DOMAIN: string | undefined
	NODE_ENV: "development" | "production"
}

// Load environment variables
await fastify.register(fastifyEnv, {
	// TODO use dotenv.path for .env.dev vs .env.production
	dotenv: true,
	data: process.env,
	confKey: "config",
	schema: {
		type: "object",
		// required: ["DB_COLLECTION"],
		properties: {
			DB_USERNAME: { type: "string" },
			DB_PASSWORD: { type: "string" },
			DB_HOST: { type: "string", default: "localhost" },
			DB_PORT: { type: "string", default: "5444" },
			OLLAMA_API: {
				type: "string",
				default: "http://localhost:11434/api/embeddings",
			},
			EMBEDDING_MODEL: { type: "string", default: "nomic-embed-text" },
			PORT: { type: "string", default: "3000" },
			HOST: { type: "string", default: "0.0.0.0" },
			NODE_ENV: { type: "string", default: "development" },
		},
	},
})

const envs = fastify.getEnvs<Envs>()

fastify.register(fastifyMultipart)
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "../public"),
})

fastify.register(AutoLoad, {
	dir: path.join(__dirname, "plugins"),
	options: Object.assign({}, opts),
})


fastify.get("/", (_req, reply) => {
	// console.log(req.body)
	reply.sendFile("index.html")
})
// fastify.get("/", async () => {
// 	return { hello: "world" }
// })

fastify.register(AutoLoad, {
	dir: path.join(__dirname, "api"),
	options: Object.assign({ prefix: "/api" }, opts),
})

fastify.register(fastifyCors, {
	origin: ["localhost", "127.0.0.1", envs.WEB_DOMAIN].filter(
		Boolean
	) as string[], // true = allow access from all origins
})

fastify.listen({ port: envs.PORT, host: envs.HOST }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	console.log(`📊 Server listening at ${address}`)
	// Server is now listening on ${address}
})
