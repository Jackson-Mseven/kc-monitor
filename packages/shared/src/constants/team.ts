/**
 * 团队加入请求类型
 * 0: 邀请
 * 1: 申请
 */
export const TEAM_JOIN_REQUEST_TYPE = {
  INVITE: 0,
  APPLY: 1,
} as const

/**
 * 团队加入请求状态
 * 0: 待处理
 * 1: 已接受
 * 2: 已拒绝
 */
export const TEAM_JOIN_REQUEST_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const
