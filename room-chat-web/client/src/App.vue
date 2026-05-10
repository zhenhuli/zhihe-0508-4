<template>
  <div class="chat-app">
    <Lobby v-if="!inRoom" @join="handleJoin" />
    <ChatRoom
      v-else
      :socket="socket"
      :nickname="nickname"
      :roomId="roomId"
      :roomName="roomName"
      @leave="handleLeave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'
import Lobby from './components/Lobby.vue'
import ChatRoom from './components/ChatRoom.vue'
import { SERVER_URL } from './config'

const STORAGE_KEY = 'room_chat_state'

const socket = ref(null)
const inRoom = ref(false)
const nickname = ref('')
const roomId = ref('')
const roomName = ref('')

function saveRoomState() {
  const state = {
    nickname: nickname.value,
    roomId: roomId.value,
    roomName: roomName.value,
    timestamp: Date.now()
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function loadRoomState() {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (!saved) return null
  
  try {
    const state = JSON.parse(saved)
    const fiveMinutes = 5 * 60 * 1000
    if (Date.now() - state.timestamp > fiveMinutes) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return state
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function clearRoomState() {
  sessionStorage.removeItem(STORAGE_KEY)
}

function handleJoin(data) {
  socket.value = io(SERVER_URL)
  nickname.value = data.nickname
  roomId.value = data.roomId
  roomName.value = data.roomName
  inRoom.value = true
  saveRoomState()
}

function handleLeave() {
  if (socket.value) {
    socket.value.emit('leaveRoom')
    socket.value.disconnect()
    socket.value = null
  }
  inRoom.value = false
  nickname.value = ''
  roomId.value = ''
  roomName.value = ''
  clearRoomState()
}

onMounted(() => {
  const savedState = loadRoomState()
  if (savedState) {
    socket.value = io(SERVER_URL)
    nickname.value = savedState.nickname
    roomId.value = savedState.roomId
    roomName.value = savedState.roomName
    inRoom.value = true
  }
})
</script>

<style scoped>
.chat-app {
  width: 100%;
  max-width: 1200px;
}
</style>
