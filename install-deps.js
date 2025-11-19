const { execSync } = require('child_process');
const path = require('path');

const projectDir = __dirname;

console.log('Installing dependencies...');
try {
  execSync('npm install', { 
    cwd: projectDir,
    stdio: 'inherit',
    shell: true,
  });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  process.exit(1);
}
