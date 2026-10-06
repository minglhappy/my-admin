<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();

/** 消息列表（每条一行文字） */
const messages = ref<string[]>([]);
/** 输入框内容 */
const input = ref('');
/** WebSocket 连接实例 */
let ws: WebSocket | null = null;

/** 建立连接（顺便讲解每个事件的含义） */
const connect = () => {
  ws = new WebSocket('ws://localhost:3000/ws/chat');

  // 连接成功（握手完成）
  ws.onopen = () => {
    messages.value.push('[系统] 连接成功，可以开始聊天');
  };

  // ★ 收到服务端推来的消息（WebSocket 的灵魂——不请自来）
  ws.onmessage = (e) => {
    messages.value.push(e.data);
  };

  // 连接断开（服务端重启/网络断）
  ws.onclose = () => {
    messages.value.push('[系统] 连接断开');
  };
};

/** 发送消息 */
const send = () => {
  // readyState === WebSocket.OPEN：只有连接是打开状态才能发
  if (input.value && ws?.readyState === WebSocket.OPEN) {
    ws.send(input.value);
    input.value = '';
  }
};

connect();

// 老规矩：组件卸载关闭连接（凡资源必清理）
onBeforeUnmount(() => ws?.close());
</script>

<template>
  <div class="page-container">
    <el-card header="WebSocket 聊天室">
      <p class="tip">开两个浏览器窗口同时进入本页，互发消息体验实时推送</p>

      <!-- 消息区 -->
      <div class="messages">
        <p v-for="(msg, i) in messages" :key="i" class="msg">{{ msg }}</p>
      </div>

      <!-- 输入区 -->
      <div class="input-row">
        <el-input v-model="input" placeholder="输入消息，回车发送" @keyup.enter="send" />
        <el-button type="primary" @click="send">发送</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.tip {
  color: $text-color-secondary;
  font-size: 13px;
}

.messages {
  height: 400px;
  padding: 10px;
  overflow-y: auto;
  background-color: #f7f8fa;
  border-radius: 4px;

  .msg {
    margin-bottom: 8px;
    padding: 6px 12px;
    background-color: #fff;
    border-radius: 4px;
  }
}

.input-row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
</style>
