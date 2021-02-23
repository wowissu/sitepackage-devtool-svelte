module.exports = {
  root: true,
  extends: "@sveltejs",
  rules: {
    'indent': ['error', 2, { 'MemberExpression': 1, 'SwitchCase': 1 }],
    eqeqeq: ['error', 'always'],
  }
}