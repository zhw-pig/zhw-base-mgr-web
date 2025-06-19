module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf', // 性能优化
        'style', // 代码格式化
        'docs',
        'test', // 测试相关
        'refactor', // 重构（非功能修改）
        'build',
        'ci',
        'chore', // 构建/工具变更
        'revert', // 回滚提交
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
}
