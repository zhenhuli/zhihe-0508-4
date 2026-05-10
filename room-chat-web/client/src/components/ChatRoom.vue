<template>
  <div class="chat-room">
    <div class="chat-header">
      <div class="room-info">
        <h2>🏠 {{ roomName }}</h2>
        <span class="my-nickname">你是: {{ nickname }}</span>
      </div>
      <div class="header-actions">
        <button class="share-btn" @click="shareRoom">
          🔗 分享房间
        </button>
        <button class="leave-btn" @click="$emit('leave')">
          退出房间
        </button>
      </div>
    </div>
    
    <div v-if="showShareModal" class="share-modal-overlay" @click.self="showShareModal = false">
      <div class="share-modal">
        <h3>分享房间</h3>
        <p class="share-room-name">{{ roomName }}</p>
        <div class="share-info">
          <div class="share-item">
            <span class="share-label">房间ID:</span>
            <span class="share-value">{{ currentRoomId }}</span>
            <button class="copy-btn" @click="copyToClipboard(currentRoomId)">复制</button>
          </div>
        </div>
        <p class="share-tip">告诉好友房间ID，让他们在主页加入房间即可</p>
        <button class="close-modal-btn" @click="showShareModal = false">关闭</button>
      </div>
    </div>

    <div class="chat-main">
      <div class="chat-sidebar">
        <h3>在线用户 ({{ onlineUsers.length }})</h3>
        <div class="user-list">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="user-item"
            :class="{ 'is-me': user.id === socketId }"
          >
            <span class="user-dot"></span>
            <span class="user-name">{{ user.nickname }}</span>
            <span v-if="user.id === socketId" class="me-tag">我</span>
          </div>
        </div>
      </div>

      <div class="chat-content">
        <div class="messages" ref="messagesContainer">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message"
            :class="getMessageClass(msg)"
          >
            <div v-if="msg.type === 'system'" class="system-message">
              {{ msg.content }}
            </div>
            <div v-else class="message-bubble">
              <div class="message-header">
                <span class="message-sender">{{ msg.sender }}</span>
                <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div
                class="message-content"
                :class="{ 'emoji-message': msg.type === 'emoji' }"
              >
                {{ msg.content }}
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <div class="emoji-picker" v-if="showEmoji">
            <button
              v-for="emoji in emojiList"
              :key="emoji"
              class="emoji-btn"
              @click="sendEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>

          <div class="input-bar">
            <button class="emoji-toggle" @click="toggleEmoji">
              😊
            </button>
            <input
              v-model="inputMessage"
              type="text"
              placeholder="输入消息..."
              @keyup.enter="sendMessage"
            />
            <button class="send-btn" @click="sendMessage">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  socket: Object,
  nickname: String,
  roomId: String,
  roomName: String
})

defineEmits(['leave'])

const messages = ref([])
const onlineUsers = ref([])
const inputMessage = ref('')
const showEmoji = ref(false)
const socketId = ref('')
const messagesContainer = ref(null)
const showShareModal = ref(false)
const currentRoomId = ref('')

const emojiList = [
  '😀', '😂', '🥰', '😎', '🤔', '😱', '😭', '😡',
  '👍', '👎', '❤️', '🔥', '🎉', '👏', '🙏', '💪'
]

onMounted(() => {
  if (props.socket) {
    props.socket.on('roomInfo', (data) => {
      currentRoomId.value = data.roomId
      messages.value = data.messages
      onlineUsers.value = data.users
      scrollToBottom()
    })

    props.socket.on('newMessage', (msg) => {
      messages.value.push(msg)
      scrollToBottom()
    })

    props.socket.on('onlineUsers', (users) => {
      onlineUsers.value = users
    })

    props.socket.on('userJoined', (user) => {
      console.log('用户加入:', user.nickname)
    })

    props.socket.on('userLeft', (user) => {
      console.log('用户离开:', user.nickname)
    })

    function joinRoom() {
      socketId.value = props.socket.id
      props.socket.emit('createRoom', {
        roomName: props.roomName,
        nickname: props.nickname
      })
    }

    if (props.socket.connected) {
      joinRoom()
    } else {
      props.socket.on('connect', () => {
        joinRoom()
      })
    }
  }
})

onUnmounted(() => {
  if (props.socket) {
    props.socket.off('roomInfo')
    props.socket.off('newMessage')
    props.socket.off('onlineUsers')
    props.socket.off('userJoined')
    props.socket.off('userLeft')
  }
})

watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

function getMessageClass(msg) {
  if (msg.type === 'system') {
    return 'system'
  }
  return msg.senderId === socketId.value ? 'own' : 'other'
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function sendMessage() {
  if (!inputMessage.value.trim()) return
  
  props.socket.emit('sendMessage', {
    content: inputMessage.value.trim()
  })
  inputMessage.value = ''
}

function sendEmoji(emoji) {
  props.socket.emit('sendEmoji', { emoji })
  showEmoji.value = false
}

function toggleEmoji() {
  showEmoji.value = !showEmoji.value
}

function shareRoom() {
  showShareModal.value = true
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('房间ID已复制到剪贴板: ' + text)
  }).catch(() => {
    alert('复制失败，请手动复制: ' + text)
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.chat-room {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-height: 700px;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-info h2 {
  font-size: 20px;
  margin: 0;
}

.my-nickname {
  font-size: 14px;
  opacity: 0.9;
}

.leave-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.share-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.share-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.share-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.share-modal {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.share-modal h3 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  font-size: 20px;
}

.share-room-name {
  text-align: center;
  color: #667eea;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 20px;
}

.share-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.share-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.share-label {
  color: #666;
  font-size: 14px;
  min-width: 60px;
}

.share-value {
  flex: 1;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: monospace;
  color: #333;
  font-size: 14px;
  border: 1px solid #e0e0e0;
}

.copy-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.copy-btn:hover {
  background: #5a6fd6;
}

.share-tip {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.close-modal-btn {
  width: 100%;
  padding: 12px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  color: #666;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.close-modal-btn:hover {
  background: #e0e0e0;
}

.chat-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-sidebar {
  width: 200px;
  background: #f8f9fa;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.chat-sidebar h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.user-list {
  overflow-y: auto;
  flex: 1;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background 0.2s;
}

.user-item:hover {
  background: #e9ecef;
}

.user-item.is-me {
  background: #e3f2fd;
}

.user-dot {
  width: 8px;
  height: 8px;
  background: #2ecc71;
  border-radius: 50%;
  margin-right: 8px;
}

.user-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.me-tag {
  background: #667eea;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.message {
  margin-bottom: 16px;
}

.system-message {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 8px;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message.own .message-bubble {
  margin-left: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}

.message.own .message-sender,
.message.own .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-sender {
  font-weight: 600;
  color: #667eea;
}

.message-time {
  color: #999;
}

.message-content {
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.emoji-message {
  font-size: 40px;
  text-align: center;
}

.chat-input {
  background: white;
  border-top: 1px solid #e0e0e0;
  position: relative;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  z-index: 100;
}

.emoji-btn {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s;
}

.emoji-btn:hover {
  background: #f0f0f0;
}

.input-bar {
  display: flex;
  padding: 12px 16px;
  gap: 12px;
}

.emoji-toggle {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.emoji-toggle:hover {
  background: #f0f0f0;
}

.input-bar input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s;
}

.input-bar input:focus {
  border-color: #667eea;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
