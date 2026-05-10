require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const net = require('net');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

const rooms = new Map();
const socketUserMap = new Map();

io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  socket.on('createRoom', ({ roomName, nickname }, callback) => {
    if (!roomName || !nickname) {
      if (typeof callback === 'function') {
        return callback({ success: false, message: '房间名和昵称不能为空' });
      }
      return;
    }

    const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        name: roomName,
        users: new Map(),
        messages: []
      });
    }

    joinRoom(socket, roomId, nickname);
    if (typeof callback === 'function') {
      callback({ success: true, roomId, roomName });
    }
  });

  socket.on('joinRoom', ({ roomId, nickname }, callback) => {
    if (!roomId || !nickname) {
      if (typeof callback === 'function') {
        return callback({ success: false, message: '房间ID和昵称不能为空' });
      }
      return;
    }

    if (!rooms.has(roomId)) {
      if (typeof callback === 'function') {
        return callback({ success: false, message: '房间不存在' });
      }
      return;
    }

    joinRoom(socket, roomId, nickname);
    if (typeof callback === 'function') {
      callback({ success: true, roomId, roomName: rooms.get(roomId).name });
    }
  });

  socket.on('leaveRoom', () => {
    const userInfo = socketUserMap.get(socket.id);
    if (userInfo) {
      leaveRoom(socket, userInfo.roomId);
    }
  });

  socket.on('sendMessage', ({ content }) => {
    console.log('收到消息:', socket.id, '->', content);
    const userInfo = socketUserMap.get(socket.id);
    console.log('用户信息:', userInfo);
    if (!userInfo) return;

    const room = rooms.get(userInfo.roomId);
    if (!room) return;

    const message = {
      id: Date.now().toString(),
      type: 'text',
      content,
      sender: userInfo.nickname,
      senderId: socket.id,
      timestamp: new Date().toISOString()
    };

    room.messages.push(message);
    io.to(userInfo.roomId).emit('newMessage', message);
  });

  socket.on('sendEmoji', ({ emoji }) => {
    const userInfo = socketUserMap.get(socket.id);
    if (!userInfo) return;

    const room = rooms.get(userInfo.roomId);
    if (!room) return;

    const message = {
      id: Date.now().toString(),
      type: 'emoji',
      content: emoji,
      sender: userInfo.nickname,
      senderId: socket.id,
      timestamp: new Date().toISOString()
    };

    room.messages.push(message);
    io.to(userInfo.roomId).emit('newMessage', message);
  });

  socket.on('getOnlineUsers', (callback) => {
    const userInfo = socketUserMap.get(socket.id);
    if (!userInfo) {
      return callback([]);
    }

    const room = rooms.get(userInfo.roomId);
    if (!room) {
      return callback([]);
    }

    const users = Array.from(room.users.values());
    callback(users);
  });

  socket.on('getRoomList', (callback) => {
    const roomList = Array.from(rooms.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      userCount: data.users.size
    }));
    console.log('获取房间列表:', roomList);
    callback(roomList);
  });

  socket.on('getHistory', (callback) => {
    const userInfo = socketUserMap.get(socket.id);
    if (!userInfo) {
      return callback([]);
    }

    const room = rooms.get(userInfo.roomId);
    if (!room) {
      return callback([]);
    }

    callback(room.messages);
  });

  socket.on('disconnect', () => {
    console.log('用户断开:', socket.id);
    const userInfo = socketUserMap.get(socket.id);
    if (userInfo) {
      leaveRoom(socket, userInfo.roomId);
    }
  });
});

function joinRoom(socket, roomId, nickname) {
  console.log('用户加入房间:', nickname, '->', roomId);
  console.log('当前所有房间:', Array.from(rooms.keys()));
  
  const room = rooms.get(roomId);
  
  const existingUser = socketUserMap.get(socket.id);
  if (existingUser && existingUser.roomId !== roomId) {
    leaveRoom(socket, existingUser.roomId);
  }

  socket.join(roomId);
  room.users.set(socket.id, {
    id: socket.id,
    nickname,
    roomId
  });
  socketUserMap.set(socket.id, {
    id: socket.id,
    nickname,
    roomId
  });

  const systemMessage = {
    id: Date.now().toString(),
    type: 'system',
    content: `${nickname} 加入了房间`,
    sender: 'system',
    senderId: 'system',
    timestamp: new Date().toISOString()
  };
  room.messages.push(systemMessage);

  io.to(roomId).emit('userJoined', { nickname, id: socket.id });
  io.to(roomId).emit('newMessage', systemMessage);

  const users = Array.from(room.users.values());
  io.to(roomId).emit('onlineUsers', users);

  socket.emit('roomInfo', {
    roomId,
    roomName: room.name,
    users,
    messages: room.messages
  });
}

function leaveRoom(socket, roomId) {
  const userInfo = socketUserMap.get(socket.id);
  if (!userInfo) return;

  socket.leave(roomId);
  
  const room = rooms.get(roomId);
  if (room) {
    room.users.delete(socket.id);

    const systemMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `${userInfo.nickname} 离开了房间`,
      sender: 'system',
      senderId: 'system',
      timestamp: new Date().toISOString()
    };
    room.messages.push(systemMessage);

    io.to(roomId).emit('userLeft', { nickname: userInfo.nickname, id: socket.id });
    io.to(roomId).emit('newMessage', systemMessage);

    const users = Array.from(room.users.values());
    io.to(roomId).emit('onlineUsers', users);

    if (room.users.size === 0) {
      rooms.delete(roomId);
    }
  }

  socketUserMap.delete(socket.id);
}

const DEFAULT_PORT = parseInt(process.env.SERVER_PORT) || 3001;

async function startServer() {
  const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : await findAvailablePort(DEFAULT_PORT);
  
  server.listen(PORT, () => {
    console.log(`\n🚀 聊天室后端服务已启动`);
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`📡 Socket.io: http://localhost:${PORT}/socket.io`);
    console.log(`\n📝 请在前端配置文件中使用此端口\n`);
  });
}

startServer();
