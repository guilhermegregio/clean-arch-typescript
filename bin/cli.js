#!/usr/bin/env node

const packJson = require('../package.json');

console.log({ name: packJson.name, version: packJson.version });
