#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const clientDir = path.resolve(__dirname);
process.chdir(clientDir);

console.log(`Starting dev server in ${clientDir}...`);

const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});
