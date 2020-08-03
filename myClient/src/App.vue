<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  sockets: {
    connect() {
      //查看socket是否渲染成功 
      console.log('成功连接上了')
    },
    updateUsers(data) {
      this.$store.commit('updateUserList', data)
    },
  },
}
</script>

