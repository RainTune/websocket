import Vue from 'vue'
import Vuex from 'vuex'
import {firstUpperCase} from '@/util'
Vue.use(Vuex)

const names = [
  { name: 'userInfo', default: {} },
  { name: 'userList', default: [] },
]
const myStates = {
  state: {},
  mutations: {}
}
names.forEach(item => {
  myStates.state[item.name] = item.default
  const val = 'update' + firstUpperCase(item.name)
  myStates.mutations[val] = function(state, newVal) {
    state[item.name] = newVal
  }
})
export default new Vuex.Store(myStates)
