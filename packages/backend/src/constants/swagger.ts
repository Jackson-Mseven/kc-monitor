import { SwaggerOptions } from '@fastify/swagger'
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import { FastifyRegisterOptions } from 'fastify'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export const SWAGGER_OPTIONS: FastifyRegisterOptions<SwaggerOptions> = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'swagger title',
      description: 'swagger description',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://127.0.0.1:3000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'role', description: 'Role related end-points' },
      { name: 'project', description: 'Project related end-points' },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
  },
  transform: jsonSchemaTransform,
}

export const SWAGGER_UI_OPTIONS: FastifyRegisterOptions<FastifySwaggerUiOptions> = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next()
    },
    preHandler: function (request, reply, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
}
