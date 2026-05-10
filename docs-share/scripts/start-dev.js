const { spawn } = require("child_process");
const net = require("net");

const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
    
    server.once("listening", () => {
      const port = server.address().port;
      server.close();
      resolve(port);
    });
    
    server.listen(startPort);
  });
};

(async () => {
  try {
    const port = await findAvailablePort(3000);
    console.log(`🚀 Starting dev server on port ${port}...`);
    
    const env = { ...process.env, PORT: port.toString() };
    const dev = spawn("npx", ["next", "dev", "-p", port.toString()], {
      stdio: "inherit",
      cwd: process.cwd(),
      env,
    });
    
    dev.on("close", (code) => {
      process.exit(code);
    });
  } catch (err) {
    console.error("Failed to start dev server:", err);
    process.exit(1);
  }
})();
