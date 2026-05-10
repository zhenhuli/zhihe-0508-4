<template>
  <div class="lobby">
    <div class="lobby-card">
      <h1>🏠 多房间聊天室</h1>
      <p class="subtitle">创建房间或加入已有房间</p>

      <div class="section">
        <h2>创建新房间</h2>
        <div class="form-group">
          <label>您的昵称</label>
          <input
            v-model="nickname"
            type="text"
            placeholder="请输入昵称"
            @keyup.enter="createRoom"
          />
        </div>
        <div class="form-group">
          <label>房间名称</label>
          <input
            v-model="newRoomName"
            type="text"
            placeholder="请输入房间名称"
            @keyup.enter="createRoom"
          />
        </div>
        <button class="btn primary" @click="createRoom">
          创建并加入
        </button>
      </div>

      <div class="section">
        <h2>现有房间</h2>
        <div class="form-group">
          <label>您的昵称</label>
          <input
            v-model="joinNickname"
            type="text"
            placeholder="请输入昵称"
          />
        </div>
        <button class="btn refresh" @click="refreshRooms">
          刷新房间列表
        </button>
        <div class="room-list" v-if="rooms.length > 0">
          <div
            v-for="room in rooms"
            :key="room.id"
            class="room-item"
            @click="joinExistingRoom(room)"
          >
            <span class="room-name">{{ room.name }}</span>
            <span class="room-users">{{ room.userCount }} 人在线</span>
          </div>
        </div>
        <p v-else class="no-rooms">暂无房间，创建一个吧！</p>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { SERVER_URL } from '../config'

const emit = defineEmits(['join'])

const socket = ref(null)
const nickname = ref('')
const newRoomName = ref('')
const joinNickname = ref('')
const rooms = ref([])
const error = ref('')

onMounted(() => {
  socket.value = io(SERVER_URL)
  socket.value.on('connect', () => {
    refreshRooms()
  })
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})

function refreshRooms() {
  if (!socket.value) return
  socket.value.emit('getRoomList', (roomList) => {
    rooms.value = roomList
  })
}

function createRoom() {
  error.value = ''
  if (!nickname.value.trim()) {
    error.value = '请输入昵称'
    return
  }
  if (!newRoomName.value.trim()) {
    error.value = '请输入房间名称'
    return
  }
  
  if (socket.value) {
    socket.value.disconnect()
  }
  
  emit('join', {
    nickname: nickname.value.trim(),
    roomId: newRoomName.value.trim().toLowerCase().replace(/\s+/g, '-'),
    roomName: newRoomName.value.trim()
  })
}

function joinExistingRoom(room) {
  error.value = ''
  if (!joinNickname.value.trim()) {
    error.value = '请输入昵称'
    return
  }
  
  if (socket.value) {
    socket.value.disconnect()
  }
  
  emit('join', {
    nickname: joinNickname.value.trim(),
    roomId: room.id,
    roomName: room.name
  })
}
</script>

<style scoped>
.lobby {
  display: flex;
  justify-content: center;
  align-items: center;
}

.lobby-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.section:first-of-type {
  border-top: none;
  padding-top: 0;
}

h2 {
  color: #444;
  margin-bottom: 16px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  color: #666;
  margin-bottom: 8px;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn.refresh {
  background: #f0f0f0;
  color: #666;
  margin-bottom: 16px;
}

.btn.refresh:hover {
  background: #e0e0e0;
}

.room-list {
  max-height: 200px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.room-item:last-child {
  border-bottom: none;
}

.room-item:hover {
  background: #f5f5f5;
}

.room-name {
  font-weight: 600;
  color: #333;
}

.room-users {
  font-size: 14px;
  color: #999;
}

.no-rooms {
  text-align: center;
  color: #999;
  padding: 20px;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 16px;
}
</style>
