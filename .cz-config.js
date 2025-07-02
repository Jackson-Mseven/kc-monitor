module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      修复Bug' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:    不影响逻辑的样式修改' },
    { value: 'refactor', name: 'refactor: 代码重构' },
    { value: 'test', name: 'test:     添加测试' },
    { value: 'chore', name: 'chore:    构建过程或辅助工具变更' },
  ],
  scopes: [
    { name: 'entry' },
    { name: 'core' },
    { name: 'react' },
    { name: 'backend' },
    { name: 'dashboard' },
    { name: 'shared' },
    { name: 'email-renderer' },
  ],
  scopeOverrides: {},
  allowCustomScopes: false, // 关闭手动输入，只允许选择
  allowBreakingChanges: ['feat', 'fix'],
  messages: {
    type: '选择提交类型:',
    scope: '选择修改范围:',
    subject: '简短描述（必填）:\n',
    body: '详细描述（可选）:\n',
    breaking: '非兼容性变更说明（可选）:\n',
    footer: '关联的 issue（可选）:',
  },
}
