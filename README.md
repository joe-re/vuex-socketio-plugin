# vuex-socketio-plugin

Vuex plugin to integrate socket.io client

## Install

```
npm install vuex-socketio-plugin --save
```

## Simple Example

store.ts

```js
import Vuex, { Store } from 'vuex'
import Vue from 'vue'
import { createSocketioPlugin } from 'vuex-socketio-plugin'
import * as io from 'socket.io-client'

Vue.use(Vuex)

let _client: (typeof io.Socket) | null = null;
export type State = { messages: string[] }
const store = new Vuex.Store<State>({
  plugins: [createSocketioPlugin('http://localhost:3000')],
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
```

## Usage

### createSocketioPlugin

Creates a new instance of the plugin. You can give an URL string or custom socket.io-client instance.

```
createSocketioPlugin('http://localhost:3000') // apply default as socket-io(auto-connect)
createSocketioPlugin(io('http://localhost:3000', { autoConnect: false }) // if you want to customize you can give any socket.io instance
```

If you want to use multi connection, you can give an array of it.

```
createSocketioPlugin([
  'http://localhost:3000/function1',
  'http://localhost:3000/function2',
  'http://localhost:3000/function3'
])
```

Prefix are set automatically to each Mutation and Action.(See [Mutation And Action](https://github.com/joe-re/vuex-socketio-plugin#mutation-and-action))
If you want to change prefix name, you can give `actionPrefix` and `mutationPrefix` options.

```
createSocketioPlugin([
  'http://localhost:3000/function1',
  'http://localhost:3000/function2',
  'http://localhost:3000/function3'
], {
  actionPrefix: 'socket/soc_',
  mutationPrefix: 'socket/SOC_'
})
```

### Mutation and Action

When receive SocketIO event, vuex-socketio-plugin triggered Mutation and Action.
MutationName is added prefix `SOCKET_`.
ActionName is added prefix `socket_`.
MutationName and ActionName are prefix + EventName.

```js
  mutations: {
    SOCKET_CONNECT(state, payload) {
      console.log('connected on mutation')
    },
  },
  actions: {
    socket_connect(context, payload) {
      console.log('connected on action')
    }
  }
```

> Note: In case of mutation, default socket.io events are UpperCase. Pleae ref [socket.io docs](https://socket.io/docs/) about type of default events.

Both of mutation and action payload includes `client` and `data` parameters.
`client` is socket.io instance. You can emit any event via this.
`data` is received message. It is always array type.


### Socket.io Namespaces and Vuex Namespaced Modules

[Socket.io namespaces](https://socket.io/docs/rooms-and-namespaces/) is mapped Vuex namespaced Modules.

If you use socket.io namespaces, you can receive which one of below types.

```js
{
  plugins: [
    createSocketioPlugin('http://localhost:3000/bar')
  ],
  mutations: {
    SOCKET_CONNECT: { ... } // default
    SOCKET_bar_CONNECT: { ... } // prefix + namespace + event name
  },
  modules: {
    bar: {
      SOCKET_CONNECT: { ... } // namespaced module + prefix + event name
    }
  }
}
```

Because this is a convention you don't have to set any configtation. It is triggered to be found mutation and action at first.

### getClients

If you get socket.io clients on your any context, you can use getClients API.

Example
```js
import { getClients } from 'vuex-socketio-plugin'
getClients().forEach(v => v.connect())
```

### Example

[example](./example)
