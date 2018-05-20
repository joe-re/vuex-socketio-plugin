<template>
  <div>
    <div class="chat-view">
      <h1>Chat1</h1>
      <chat :messages="chat1Messages" @post="(message) => handleSubmit(message, 'chat1')"/>
    </div>
    <div class="chat-view">
      <h1>Chat2</h1>
      <chat :messages="chat2Messages" @post="(message) => handleSubmit(message, 'chat2')"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Chat from './chat.vue'
export default Vue.extend({
  components: { Chat },
  methods: {
    handleSubmit(message: string, nsp: string) {
      this.$store.dispatch({ type: `${nsp}/postMessage`, message })
    }
  },
  computed: {
    chat1Messages(): string[] {
      return this.$store.state.chat1.messages;
    },
    chat2Messages(): string[] {
      return this.$store.state.chat2.messages;
    }
  }
})
</script>
<style scoped>
.chat-view {
  width: 48%;
  display: inline-block;
  border: 2px solid black;
  border-radius: 8px;
}
</style>
