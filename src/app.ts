import { join } from "node:path"
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload"
import { FastifyPluginAsync, FastifyServerOptions } from "fastify"
import { fastifyEnv } from "@fastify/env"
import { fastifyMultipart } from "@fastify/multipart"
import { fastifyCors } from "@fastify/cors"
import { fastifyStatic } from "@fastify/static"

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

export interface AppOptions
	extends FastifyServerOptions,
		Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts
): Promise<void> => {
	await fastify.register(fastifyEnv, {
		// TODO use dotenv.path for .env.dev vs .env.production
		dotenv: true,
		// dotenv: {
		//   path: "../.env"
		// },
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
		root: join(__dirname, "../public"),
	})

	fastify.register(fastifyCors, {
		origin: ["localhost", "127.0.0.1", envs.WEB_DOMAIN].filter(
			Boolean
		) as string[], // true = allow access from all origins
	})

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	// eslint-disable-next-line no-void
	void fastify.register(AutoLoad, {
		dir: join(__dirname, "plugins"),
		options: opts,
	})

	// This loads all plugins defined in routes
	// define your routes in one of these
	// eslint-disable-next-line no-void
	void fastify.register(AutoLoad, {
		dir: join(__dirname, "routes"),
		options: opts,
	})

  // TODO do i not need this?
	// fastify.listen({ port: envs.PORT, host: envs.HOST }, function (err, address) {
	// 	if (err) {
	// 		fastify.log.error(err)
	// 		process.exit(1)
	// 	}
	// 	console.log(`📊 Server listening at ${address}`)
	// 	// Server is now listening on ${address}
	// })
}

export default app
export { app, options }
