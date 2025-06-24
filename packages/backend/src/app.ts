import Fastify from 'fastify'
import path from 'path'
import autoload from '@fastify/autoload'
import { logger } from './constants/logger'

const fastify = Fastify({
  logger,
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes'),
})

export default fastify
