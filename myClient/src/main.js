import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/reset.css'

import VueSocketio from 'vue-socket.io';
Vue.use(new VueSocketio({
  debug: true,
  connection: 'http://localhost:3000'
}));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
