'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://47.99.192.245:8087"',
  MOCK:'true'
  // BASE_API: '"http://118.31.120.192:8087"'
})
