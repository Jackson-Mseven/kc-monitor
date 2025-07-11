import { CustomResponseSchema, TEAM_PERMISSIONS } from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import generateReadHandler from 'src/utils/handler/generateReadHandler'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'

export default async function (fastify: FastifyInstance) {
  // 获取所有项目平台
  fastify.get(
    '/',
    {
      schema: {
        tags: ['project'],
        summary: '获取所有项目平台',
        description: '获取所有项目平台',
        response: { 200: CustomResponseSchema },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
    },
    generateReadHandler(fastify, {
      model: 'project_platforms',
    })
  )
}
