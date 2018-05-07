'use strict';

const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // Uncomment this if you want to test against a development API
    // API_URL: '"http://localhost:8000/api"',
});
