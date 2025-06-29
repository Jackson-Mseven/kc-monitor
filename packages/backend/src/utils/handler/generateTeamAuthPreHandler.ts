import { TeamPermissionValues } from '@kc-monitor/shared'
import buildErrorByCode from '../error/buildErrorByCode'

export function generateTeamAuthPreHandler(permission: TeamPermissionValues) {
  return async function (request, reply) {
    const userId = request.user?.id
    const user = await request.server.prisma.users.findUnique({
      where: { id: userId },
    })
    if (!user)
      return reply.sendResponse({
        ...buildErrorByCode(401),
        message: '用户不存在',
      })
    if (!user.team_role_id) {
      return reply.sendResponse({
        ...buildErrorByCode(403),
        message: '用户无权限',
      })
    }

    const role = await request.server.prisma.team_roles.findFirst({
      where: { id: user.team_role_id },
    })
    if (!(role?.permissions as TeamPermissionValues[])?.includes(permission)) {
      return reply.sendResponse({
        ...buildErrorByCode(403),
        message: '用户无权限',
      })
    }
  }
}
