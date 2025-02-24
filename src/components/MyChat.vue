<template>
  <div class="container">
    <div v-if="!connected" class="login-box">
      <input v-model="username" placeholder="Votre pseudo..." class="input-box" />
      <input v-model="chatRoom" placeholder="Nom du salon..." class="input-box" />
      <button @click="joinChat" class="btn-connect">Se connecter</button>
    </div>

    <div v-else class="chat-box">
      <div class="chat-messages" ref="messageContainer">
        <div v-for="msg in chatMessages" :key="msg.timestamp"
             :class="['chat-bubble', messageClass(msg)]">
          <div v-if="msg.sender !== 'SYSTEM'" class="message-header">
            <span class="user">{{ msg.sender }}</span>
            <span class="timestamp">{{ formatTimestamp(msg.timestamp) }}</span>
          </div>
          <p class="message-content">{{ msg.text }}</p>
        </div>
      </div>

      <div class="input-area">
        <input v-model="messageText" @keyup.enter="sendChatMessage" placeholder="Votre message..."
               class="message-box" />
        <button @click="sendChatMessage" class="btn-send">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  text: string;
  timestamp: string;
  sender: string;
}

export default {
  setup() {
    const chatMessages = ref<ChatMessage[]>([]);
    const messageText = ref<string>('');
    const username = ref<string>('');
    const chatRoom = ref<string>('general');
    const connected = ref<boolean>(false);
    let socketInstance: Socket | null = null;

    const initializeSocket = () => {
      if (!socketInstance) {
        socketInstance = io('https://mohammedelmehdi.makhlouk.angers.mds-project.fr', {
          transports: ['websocket'],
        });

        socketInstance.on('connect', () => console.log('Connexion établie.'));
        socketInstance.on('chat-msg', receiveChatMessage);
      }
    };

    const joinChat = () => {
      if (!username.value.trim()) {
        console.error('Le pseudo est requis.');
        return;
      }

      initializeSocket();
      socketInstance?.emit('chat-join-room', { pseudo: username.value, roomName: chatRoom.value });
      connected.value = true;
    };

    const sendChatMessage = () => {
      if (messageText.value.trim()) {
        socketInstance?.emit('chat-msg', { content: messageText.value, roomName: chatRoom.value });
        messageText.value = '';
      }
    };

    const receiveChatMessage = (message: { content: string; dateEmis: string; pseudo: string }) => {
      chatMessages.value.push({
        text: message.content,
        timestamp: message.dateEmis,
        sender: message.pseudo,
      });
    };

    const formatTimestamp = (dateString: string): string => {
      return new Date(dateString).toLocaleString();
    };

    const messageClass = (msg: ChatMessage): string => {
      if (msg.sender === username.value) return 'user-msg';
      if (msg.sender === 'SYSTEM') return 'system-msg';
      return 'other-msg';
    };

    onMounted(() => {
      if (!socketInstance) {
        console.warn('Le socket n\'est pas encore connecté.');
      }
    });

    return {
      chatMessages,
      messageText,
      username,
      chatRoom,
      connected,
      joinChat,
      sendChatMessage,
      formatTimestamp,
      messageClass,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f9;
}

.login-box {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-box {
  padding: 10px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.btn-connect {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.btn-connect:hover {
  background: #0056b3;
}

.chat-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  background: #fafafa;
  border-radius: 10px;
  max-height: 70%;
}

.chat-bubble {
  padding: 10px;
  margin: 8px;
  border-radius: 10px;
  max-width: 75%;
}

.message-header {
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
}

.timestamp {
  font-style: italic;
  color: #aaa;
}

.message-content {
  margin-top: 5px;
  word-wrap: break-word;
}

.input-area {
  display: flex;
  padding: 10px;
  background: #ffffff;
  border-top: 1px solid #ddd;
}

.message-box {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-right: 10px;
}

.btn-send {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}

.user-msg {
  background: #e1ffc7;
  align-self: flex-end;
}

.system-msg {
  background: #f7d6d6;
  text-align: center;
}

.other-msg {
  background: #e4e9f7;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .login-box, .chat-box {
    width: 100%;
  }

  .input-box, .message-box {
    width: 80%;
  }
}
</style>
