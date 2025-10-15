'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { status: 'ok', message: 'RAG API is running' }
  })
}