<template>
  <div class="login">
    <div class="login_container">
      <h3 class="text_center">用户登录</h3>
      <div class="login_form_item">
        <p>用户名</p>
        <div class="login_item_content">
          <Input 
            prefix-icon="el-icon-user"
            placeholder="请输入用户名" 
            v-model="username"/>
        </div>
      </div>
      <div class="login_form_item">
        <p>头像</p>
        <div class="login_img_container login_item_content">
          <div class="img_wrapper" 
            v-for="(item,i) in imgList" 
            :key="i" 
            @click="activeImg = item"
            :class="{active: item == activeImg}">
            <img :src="item">
          </div>
        </div>
      </div>
      <div class="login_form_item">
        <Button 
          @click="doLogin"
          plain :disabled="isDisable">
          登录 <i class="el-icon-thumb"></i>
        </Button>
      </div>
    </div> 
  </div>
</template>

<script>
import { Button, Input, Message } from 'element-ui'
export default {
  name: 'Login',
  components: {
    Button,
    Input,
  }, 
  sockets: {
    loginSuccess(data) {
      this.$store.commit('updateUserInfo', data)
      Message.success({
        message: '恭喜您登录成功',
        duration: 1500,
        onClose: () => {
          this.$router.push('/chat')
        }
      })
    },
    loginError(data) {
      Message.error({
        message: data.msg
      })
    }
  },
  data() {
    return {
      username: '',
      imgList: [],
      activeImg: ''
    }
  },
  created() {
    for(let i = 1; i <= 10; i++) {
      this.imgList.push(require(`../assets/imgs/avators/${i}.jpg`))
    }
  },
  computed: {
    isDisable() {
      return !this.username.trim() || !this.activeImg
    }
  },
  methods: {
    doLogin() {
      this.$socket.emit('login', {
        username: this.username,
        avator: this.activeImg
      })
    }
  }
}
</script>
<style lang="scss">
  .login {
    width: 100vw;
    height: 100vh;
    background-image: url('../assets/imgs/bg.jpg');
    background-position: center;
    background-size: cover;
    display: flex;
    align-items: center;
    .login_container{
      width: 380px;
      height: 360px;
      border: 1px solid #333;
      background-image: linear-gradient(to bottom, white, black 80%);
      border-radius: 10px;
      padding: 10px;
      transform: translateX(50%);
      .login_form_item{
        // margin-bottom: 10px;
        .login_item_content{
          padding: 10px 0;
        }
        .login_img_container{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .img_wrapper{
            width: 60px;
            height: 60px;
            margin-bottom: 10px;
            border: 2px solid transparent;
            cursor: pointer;
            border-radius: 50%;
            overflow: hidden;
            &.active{
              border-color: yellow;
            }
            img{
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .el-button{
        display: block;
        width: 100%;
      }
    }
  }
</style>