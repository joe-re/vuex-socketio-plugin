import Vuex, { Store, Module } from 'vuex'
import Vue from 'vue'
import { createSocketioPlugin } from '../../../../src/index'
import chat1, { State as Chat1State } from './Chat1'
import chat2, { State as Chat2State } from './Chat2'
import * as io from 'socket.io-client'

Vue.use(Vuex)

export type RootState = { chat1: Chat1State, chat2: Chat2State }

const store = new Vuex.Store<RootState>({
  plugins: [createSocketioPlugin(['http://localhost:3000/chat1', 'http://localhost:3000/chat2'])],
  modules: { chat1, chat2 },
})

export default store
