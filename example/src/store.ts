import Vuex, { Store } from 'vuex'
import Vue from 'vue'
import { createWebsocketPlugin } from '../../dist/index'
import * as io from 'socket.io-client'

Vue.use(Vuex)

let _client: (typeof io.Socket) | null = null;
export type State = { messages: string[] }
const store = new Vuex.Store<State>({
  plugins: [createWebsocketPlugin('http://localhost:3000')],
  state: {
    messages: []
  },
  mutations: {
    SOCKET_CONNECT(state, { client }) {
      console.log('connected')
      _client = client;
    },
    SOCKET_CHAT_MESSAGE(state, { data }) {
      state.messages = state.messages.concat([data[0]])
    }
  },
  actions: {
    postMessage(context, payload: { message: string }) {
      if (!_client) {
        throw new Error("don't have connection")
      }
      _client.emit('CHAT_MESSAGE', payload.message)
    }
  }
})

export default store
