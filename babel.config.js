module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ["module-resolver", {
      "root": ["."],
      "alias": {
        "e2e-test-page": "./test/e2e/test-page/index.ts"
      }
    }]
  ]
}