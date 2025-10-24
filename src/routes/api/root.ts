'use strict'

import { FastifyInstance } from "fastify"

module.exports = async function (fastify:FastifyInstance, _opts:Object) {
  fastify.get('/', async function () {
    return { status: 'ok', message: 'RAG API is running' }
  })
}