import { Module } from 'vuex'
import * as io from 'socket.io-client'
import { RootState } from './index'

export type State = { messages: string[] }

let _client: (typeof io.Socket) | null = null;
const chat2: Module<State, RootState> = {
  namespaced: true,
  state: { messages: [] },
  mutations: {
    SOCKET_CONNECT(state, { client }) {
      console.log('chat2/connected')
      console.log(client)
      _client = client
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
}

export default chat2;