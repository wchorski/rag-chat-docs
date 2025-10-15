import type { FastifyInstance } from "fastify";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function routes (fastify: FastifyInstance, options: Object) {
  fastify.get('/hello', async () => {
    return { hello: 'world' }
  })
}