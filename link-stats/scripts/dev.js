const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;
  while (port < startPort + 100) {
    if (await checkPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error('No available ports found');
}

function spawnProcess(command, args, options, label) {
  const child = spawn(command, args, {
    ...options,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32'
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`[${label}] ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`[${label}] ${line}`);
      }
    });
  });

  child.on('exit', (code) => {
    console.log(`[${label}] Process exited with code ${code}`);
    if (code !== 0) {
      process.exit(code);
    }
  });

  return child;
}

async function main() {
  console.log('🚀 启动短链接统计平台...');
  console.log('========================================');
  
  try {
    const backendPort = await findAvailablePort(8080);
    const frontendPort = await findAvailablePort(3000);
    
    console.log(`📌 后端端口: ${backendPort}`);
    console.log(`📌 前端端口: ${frontendPort}`);
    console.log('========================================');
    
    const serverDir = path.join(__dirname, '..', 'server');
    const clientDir = path.join(__dirname, '..', 'client');
    
    console.log('📦 正在启动后端服务...');
    const serverProcess = spawnProcess(
      'npx',
      ['ts-node', 'src/index.ts'],
      { cwd: serverDir },
      'BACKEND'
    );
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🎨 正在启动前端服务...');
    const clientProcess = spawnProcess(
      'npx',
      ['vite'],
      { 
        cwd: clientDir,
        env: {
          ...process.env,
          VITE_BACKEND_PORT: backendPort.toString(),
          VITE_FRONTEND_PORT: frontendPort.toString()
        }
      },
      'FRONTEND'
    );
    
    process.on('SIGINT', () => {
      console.log('\n🛑 正在关闭服务...');
      serverProcess.kill();
      clientProcess.kill();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 正在关闭服务...');
      serverProcess.kill();
      clientProcess.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ 启动失败:', error.message);
    process.exit(1);
  }
}

main();
