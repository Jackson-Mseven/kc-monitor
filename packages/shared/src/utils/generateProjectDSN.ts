type GenerateProjectDSN = (params: { publicKey: string; host: string; projectId: number }) => string

/**
 * 生成项目DSN
 */
const generateProjectDSN: GenerateProjectDSN = ({ publicKey, host, projectId }) => {
  if (!publicKey || !projectId) {
    throw new Error('publicKey and projectId are required to generate a Project DSN')
  }

  return `https://${publicKey}@${host}/${projectId}`
}

export default generateProjectDSN
