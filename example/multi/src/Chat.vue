<template>
  <div class="chat">
    <ul class="messages">
      <li v-for="v in messages" :key="v">{{v}}</li>
    </ul>
    <form @submit.prevent="handleSubmit">
      <input v-model="text">
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return { text: '' }
  },
  props: ['messages'],
  methods: {
    handleSubmit() {
      this.$emit('post', this.text)
      this.text = ''
    }
  }
})
</script>

<style scoped>
.chat { padding: 4px; }
form { background: #000; padding: 3px; }
form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
.messages { list-style-type: none; margin: 0; padding: 0; }
.messages li { padding: 5px 10px; }
.messages li:nth-child(odd) { background: #eee; }
.messages { margin-bottom: 40px }
</style>
