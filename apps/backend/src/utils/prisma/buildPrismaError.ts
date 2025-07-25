import { DEFAULT_ERROR } from 'src/constants/error'

export default function (
  prismaCode: string,
  options?: { code?: number; error?: string; message?: string }
):
  | {
      code: number
      data: {
        error: string
        message: string
      }
    }
  | undefined {
  switch (prismaCode) {
    case 'P2000':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '字段值太长，超出数据库允许的长度',
        },
      }
    case 'P2001':
      return {
        code: options?.code ?? 404,
        data: {
          error: options?.error ?? 'NotFound',
          message: options?.message ?? '找不到对应的记录',
        },
      }
    case 'P2002':
      return {
        code: options?.code ?? 409,
        data: {
          error: options?.error ?? 'Conflict',
          message: options?.message ?? '唯一约束违反',
        },
      }
    case 'P2003':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '外键约束错误',
        },
      }
    case 'P2004':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '数据库约束失败',
        },
      }
    case 'P2005':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '字段值无效',
        },
      }
    case 'P2006':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '提供的值无效',
        },
      }
    case 'P2007':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '数据验证失败',
        },
      }
    case 'P2008':
      return {
        code: options?.code ?? 500,
        data: {
          error: options?.error ?? 'ServerError',
          message: options?.message ?? '查询解析失败',
        },
      }
    case 'P2009':
      return {
        code: options?.code ?? 500,
        data: {
          error: options?.error ?? 'ServerError',
          message: options?.message ?? '查询验证失败',
        },
      }
    case 'P2010':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '原始查询失败',
        },
      }
    case 'P2011':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '字段值无效',
        },
      }
    case 'P2012':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '缺少必需的字段',
        },
      }
    case 'P2013':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '参数数量不匹配',
        },
      }
    case 'P2014':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '更改会导致循环或所需的关系缺失',
        },
      }
    case 'P2015':
      return {
        code: options?.code ?? 404,
        data: {
          error: options?.error ?? 'NotFound',
          message: options?.message ?? '相关记录不存在',
        },
      }
    case 'P2016':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '查询解释失败',
        },
      }
    case 'P2017':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '连接的记录不存在',
        },
      }
    case 'P2018':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '要求的记录不存在',
        },
      }
    case 'P2019':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '输入的字段无效',
        },
      }
    case 'P2020':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '字段值超出允许范围',
        },
      }
    case 'P2021':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '表不存在',
        },
      }
    case 'P2022':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '列不存在',
        },
      }
    case 'P2023':
      return {
        code: options?.code ?? 400,
        data: {
          error: options?.error ?? 'BadRequest',
          message: options?.message ?? '表缺少必需的列',
        },
      }
    case 'P2024':
      return {
        code: options?.code ?? 503,
        data: {
          error: options?.error ?? 'ServiceUnavailable',
          message: options?.message ?? '数据库超载，无法处理请求',
        },
      }
    case 'P2025':
      return {
        code: options?.code ?? 404,
        data: {
          error: options?.error ?? 'NotFound',
          message: options?.message ?? '未找到对应记录',
        },
      }
    default:
      return {
        code: options?.code ?? DEFAULT_ERROR.CODE,
        data: {
          error: options?.error ?? DEFAULT_ERROR.DATA.ERROR,
          message: options?.message ?? DEFAULT_ERROR.DATA.MESSAGE,
        },
      }
  }
}
