import Vue from 'vue'
import store from './store'
new Vue({
  el: '#app',
  store,
  render: h => h(require('./App').default)
})
