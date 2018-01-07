import * as io from 'socket.io-client'
import { Store } from 'vuex'

type Packet = { nsp: string, data: Array<any> }
function findName (params: { nameList: { [key: string]: Function }, nsp: string, wsMessageName: string, prefix?: string }) {
  const { nameList, nsp, wsMessageName, prefix } = params
  const names = [(prefix || '') + wsMessageName]
  if (nsp !== '/') {
    names.unshift(`${nsp.slice(1)}/${prefix}${wsMessageName}`)
    names.unshift(`${prefix}${nsp.slice(1)}_${wsMessageName}`)
  }
  return names.find(v => !!nameList[v])
}

function callStoreAction<S> (client: typeof io.Socket, store: Store<S>, packet: Packet) {
  const actionName = findName({ nameList: (store as any)._actions, nsp: packet.nsp, wsMessageName: packet.data[0], prefix: 'socket_' })
  if (actionName) {
    store.dispatch(actionName, { data: [...packet.data.slice(1)], client })
  }
}

function callStoreMutation<S> (client: typeof io.Socket, store: Store<S>, packet: Packet) {
  const mutationName = findName({ nameList: (store as any)._mutations, nsp: packet.nsp, wsMessageName: packet.data[0], prefix: 'SOCKET_' })
  if (mutationName) {
    store.commit(mutationName, { data: [...packet.data.slice(1)], client })
  }
}

let clients: typeof io.Socket[] = []
export function getClients () {
  return clients
}
export function createSocketioPlugin<S> (params: string | typeof io.Socket | Array<string | typeof io.Socket>) {
  const payload = Array.isArray(params) ? params : [params]
  clients = payload.map(v => typeof v === 'string' ? io(v) : v)
  return (store: Store<S>) => {
    clients.forEach(client => {
      const onevent = (client as any).onevent;
      (client as any).onevent = (packet: Packet) => {
        onevent.call(client, packet)
        callStoreAction(client, store, packet)
        callStoreMutation(client, store, packet)
      };
      [
        'connect',
        'error',
        'disconnect',
        'reconnect',
        'reconnect_attempt',
        'reconnecting',
        'reconnect_error',
        'reconnect_failed',
        'connect_error',
        'connect_timeout',
        'connecting',
        'ping',
        'pong'
      ].forEach((value) => {
        client.on(value, (_data: any) => {
          callStoreAction(client, store, { nsp: client.nsp, data: [value] })
          callStoreMutation(client, store, { nsp: client.nsp, data: [value.toUpperCase()] })
        })
      })
    })
  }
}
