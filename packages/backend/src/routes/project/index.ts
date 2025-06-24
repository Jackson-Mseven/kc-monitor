import { FastifyInstance } from 'fastify'
import { Project, UserProject } from 'src/types/project'

type Params = Pick<Project, 'id'>
type Querystring = Pick<Project, 'name'>

export default async function (fastify: FastifyInstance) {
  // 获取所有项目
  fastify.get('/', async (request, reply) => {
    try {
      const projects = await fastify.prisma.project.findMany()
      return reply.send(projects)
    } catch (error) {
      return reply.status(500).send({ message: 'Internal server error', error })
    }
  })

  // 获取单个项目
  fastify.get<{
    Params: Params
  }>('/:id', async (request, reply) => {
    const { id } = request.params
    const project = await fastify.prisma.project.findUnique({ where: { id: Number(id) } })

    if (!project) {
      return reply.status(404).send({ message: '项目不存在' })
    }

    return reply.send(project)
  })

  // 创建项目
  fastify.post<{
    Querystring: Querystring
  }>('/', async (request, reply) => {
    const { name } = request.query
    if (!name) {
      return reply.status(400).send({ message: '缺少必须的参数' })
    }

    try {
      const project = await fastify.prisma.project.create({
        data: request.query,
      })
      return reply.status(201).send(project)
    } catch (error: any) {
      return reply.status(500).send({ message: 'Internal server error' })
    }
  })

  // 更新项目信息
  fastify.put<{
    Params: Params
    Querystring: Querystring
  }>('/:id', async (request, reply) => {
    const { id } = request.params
    const { name } = request.query

    if (!name) {
      return reply.status(400).send({ message: '没有要更新的字段' })
    }

    try {
      const project = await fastify.prisma.project.update({
        where: { id: Number(id) },
        data: request.query,
      })
      return reply.send(project)
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: '用户不存在' })
      }
      if (error.code === 'P2002') {
        return reply.status(409).send({ message: '邮箱已经存在' })
      }
      return reply.status(500).send({ message: 'Internal server error' })
    }
  })

  // 删除项目
  fastify.delete<{
    Params: Params
  }>('/:id', async (request, reply) => {
    const { id } = request.params

    try {
      await fastify.prisma.project.delete({
        where: { id: Number(id) },
      })
      return reply.send({ message: '项目已删除' })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: '项目不存在' })
      }
      return reply.status(500).send({ message: 'Internal server error' })
    }
  })

  // 添加用户加入项目
  fastify.post<{
    Params: Params
    Querystring: Pick<UserProject, 'user_id' | 'role_id'>
  }>('/:id/users', async (request, reply) => {
    const { id } = request.params
    const { user_id, role_id } = request.query
    if (!user_id || !role_id) {
      return reply.status(400).send({ message: '缺少必须的参数' })
    }

    try {
      const project = await fastify.prisma.project.findUnique({
        where: { id: Number(id) },
      })
      if (!project) {
        return reply.status(404).send({ message: '项目不存在' })
      }

      const user = await fastify.prisma.user.findUnique({
        where: { id: Number(user_id) },
      })
      if (!user) {
        return reply.status(404).send({ message: '用户不存在' })
      }

      const exist = await fastify.prisma.user_project.findFirst({
        where: {
          user_id: Number(user_id),
          project_id: Number(id),
        },
      })
      if (exist) {
        return reply.status(409).send({ message: '用户已在该项目中' })
      }

      const validRole = await fastify.prisma.role.findUnique({
        where: { id: Number(role_id) },
      })
      if (!validRole) {
        return reply.status(400).send({ message: '非法的角色' })
      }

      const userProject = await fastify.prisma.user_project.create({
        data: {
          project_id: Number(id),
          user_id: Number(user_id),
          role_id: Number(role_id),
        },
      })
      return reply.status(201).send(userProject)
    } catch (error: any) {
      return reply.status(500).send({ message: 'Internal server error', error })
    }
  })

  // 移除用户出项目
  fastify.delete<{
    Params: Params & Pick<UserProject, 'user_id'>
  }>('/:id/users/:user_id', async (request, reply) => {
    const { id, user_id } = request.params

    try {
      const userProject = await fastify.prisma.user_project.findFirst({
        where: {
          user_id: Number(user_id),
          project_id: Number(id),
        },
      })
      if (!userProject) {
        throw { code: 'P2025' }
      }
      await fastify.prisma.user_project.delete({
        where: {
          id: userProject.id,
        },
      })
      return reply.send({ message: '用户已移出项目' })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: '用户未在该项目中' })
      }
      return reply.status(500).send({ message: 'Internal server error', error })
    }
  })
}
