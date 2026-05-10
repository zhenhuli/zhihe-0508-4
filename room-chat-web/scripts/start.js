const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      server.close();
      resolve(findAvailablePort(startPort + 1));
    });
    server.once('listening', () => {
      const port = server.address().port;
      server.close();
      resolve(port);
    });
    server.listen(startPort);
  });
}

async function start() {
  console.log('🚀 正在启动多房间聊天室...\n');

  const serverPort = await findAvailablePort(3001);
  const clientPort = await findAvailablePort(5173);

  console.log(`📍 后端端口: ${serverPort}`);
  console.log(`📍 前端端口: ${clientPort}\n`);

  const serverEnv = {
    ...process.env,
    SERVER_PORT: serverPort.toString()
  };

  const clientEnv = {
    ...process.env,
    SERVER_PORT: serverPort.toString(),
    CLIENT_PORT: clientPort.toString()
  };

  const serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..', 'server'),
    env: serverEnv,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  const clientProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..', 'client'),
    env: clientEnv,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[后端] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[后端错误] ${data.toString().trim()}`);
  });

  clientProcess.stdout.on('data', (data) => {
    console.log(`[前端] ${data.toString().trim()}`);
  });

  clientProcess.stderr.on('data', (data) => {
    console.error(`[前端错误] ${data.toString().trim()}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`\n后端服务已退出，退出码: ${code}`);
    clientProcess.kill();
    process.exit(code);
  });

  clientProcess.on('close', (code) => {
    console.log(`\n前端服务已退出，退出码: ${code}`);
    serverProcess.kill();
    process.exit(code);
  });

  process.on('SIGINT', () => {
    console.log('\n\n👋 正在停止服务...');
    serverProcess.kill();
    clientProcess.kill();
    process.exit(0);
  });
}

start().catch(console.error);
