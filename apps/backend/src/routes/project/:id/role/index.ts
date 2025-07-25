import {
  CustomResponseSchema,
  ProjectRole,
  TeamRoleParamsSchema,
  TeamRoleSchema,
} from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import generateCreateHandler from 'src/utils/handler/generateCreateHandler'
import generateDeleteHandler from 'src/utils/handler/generateDeleteHandler'
import generateReadByIdHandler from 'src/utils/handler/generateReadByIdHandler'
import generateReadHandler from 'src/utils/handler/generateReadHandler'
import generateUpdateHandler from 'src/utils/handler/generateUpdateHandler'

interface Params {
  ProjectRole: {
    role_id: string
  }
}

interface Body {
  Create: Pick<ProjectRole, 'name' | 'description' | 'permissions'>
  Update: Pick<ProjectRole, 'name' | 'description' | 'permissions'>
}

export default async function (fastify: FastifyInstance) {
  // 获取所有团队角色
  fastify.get(
    '/',
    {
      schema: {
        tags: ['project'],
        summary: '获取所有项目角色',
        description: '获取所有项目角色',
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadHandler(fastify, {
      model: 'project_roles',
    })
  )

  // 获取单个团队角色
  fastify.get<{
    Params: Params['ProjectRole']
  }>(
    '/:role_id',
    {
      schema: {
        tags: ['project'],
        summary: '获取单个项目角色',
        description: '获取单个项目角色',
        params: TeamRoleParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadByIdHandler<Params['ProjectRole']>(fastify, {
      model: 'project_roles',
      idKey: 'role_id',
      notFoundMessage: '项目角色不存在',
    })
  )

  // 创建团队角色
  fastify.post<{
    Body: Body['Create']
  }>(
    '/',
    {
      schema: {
        tags: ['project'],
        summary: '创建项目角色',
        description: '创建项目角色',
        body: TeamRoleSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateCreateHandler<Body['Create']>(fastify, {
      model: 'project_roles',
      uniqueMessage: '项目角色已存在',
    })
  )

  // 更新团队角色
  fastify.put<{
    Params: Params['ProjectRole']
    Body: Body['Update']
  }>(
    '/:role_id',
    {
      schema: {
        tags: ['project'],
        summary: '更新项目角色',
        description: '更新项目角色',
        params: TeamRoleParamsSchema,
        body: TeamRoleSchema.partial().refine((data) => Object.keys(data).length > 0, {
          message: '更新内容不能为空',
        }),
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateUpdateHandler<Params['ProjectRole'], Body['Update']>(fastify, {
      model: 'project_roles',
      idKey: 'role_id',
      notFoundMessage: '项目角色不存在',
      uniqueMessage: '项目角色已存在',
    })
  )

  // 删除团队角色
  fastify.delete<{
    Params: Params['ProjectRole']
  }>(
    '/:role_id',
    {
      schema: {
        tags: ['project'],
        summary: '删除项目角色',
        description: '删除项目角色',
        params: TeamRoleParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    generateDeleteHandler<Params['ProjectRole']>(fastify, {
      model: 'project_roles',
      idKey: 'role_id',
      notFoundMessage: '项目角色不存在',
      successMessage: '项目角色已删除',
    })
  )
}
