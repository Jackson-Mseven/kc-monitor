import { CustomResponseSchema, TeamRoleParamsSchema, TeamRoleSchema } from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import { TeamRole } from 'src/types/team'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import generateCreateHandler from 'src/utils/handler/generateCreateHandler'
import generateDeleteHandler from 'src/utils/handler/generateDeleteHandler'
import generateReadByIdHandler from 'src/utils/handler/generateReadByIdHandler'
import generateReadHandler from 'src/utils/handler/generateReadHandler'
import generateUpdateHandler from 'src/utils/handler/generateUpdateHandler'

interface Params {
  TeamRole: {
    role_id: string
  }
}

interface Body {
  Create: Pick<TeamRole, 'name' | 'description' | 'permissions'>
  Update: Pick<TeamRole, 'name' | 'description' | 'permissions'>
}

export default async function (fastify: FastifyInstance) {
  // 获取所有团队角色
  fastify.get(
    '/',
    {
      schema: {
        tags: ['team'],
        summary: '获取所有团队角色',
        description: '获取所有团队角色',
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadHandler(fastify, {
      model: 'team_roles',
    })
  )

  // 获取单个团队角色
  fastify.get<{
    Params: Params['TeamRole']
  }>(
    '/:role_id',
    {
      schema: {
        tags: ['team'],
        summary: '获取单个团队角色',
        description: '获取单个团队角色',
        params: TeamRoleParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadByIdHandler<Params['TeamRole']>(fastify, {
      model: 'team_roles',
      idKey: 'role_id',
      notFoundMessage: '团队角色不存在',
    })
  )

  // 创建团队角色
  fastify.post<{
    Body: Body['Create']
  }>(
    '/',
    {
      schema: {
        tags: ['team'],
        summary: '创建团队角色',
        description: '创建团队角色',
        body: TeamRoleSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateCreateHandler<Body['Create']>(fastify, {
      model: 'team_roles',
      uniqueMessage: '团队角色已存在',
    })
  )

  // 更新团队角色
  fastify.put<{
    Params: Params['TeamRole']
    Body: Body['Update']
  }>(
    '/:role_id',
    {
      schema: {
        tags: ['team'],
        summary: '更新团队角色',
        description: '更新团队角色',
        params: TeamRoleParamsSchema,
        body: TeamRoleSchema.partial().refine((data) => Object.keys(data).length > 0, {
          message: '更新内容不能为空',
        }),
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateUpdateHandler<Params['TeamRole'], Body['Update']>(fastify, {
      model: 'team_roles',
      idKey: 'role_id',
      notFoundMessage: '团队角色不存在',
      uniqueMessage: '团队角色已存在',
    })
  )

  // 删除团队角色
  fastify.delete<{
    Params: Params['TeamRole']
  }>(
    '/:role_id',
    {
      schema: {
        tags: ['team'],
        summary: '删除团队角色',
        description: '删除团队角色',
        params: TeamRoleParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    generateDeleteHandler<Params['TeamRole']>(fastify, {
      model: 'team_roles',
      idKey: 'role_id',
      notFoundMessage: '团队角色不存在',
      successMessage: '团队角色已删除',
    })
  )
}
