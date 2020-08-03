<template>
  <div class="chat">
    <div class="chat_container">
      <div class="chat_left">
        <ul class="chat_my">
          <li class="chat_my_info">
            <img :src="userInfo.avator">
            <span>{{userInfo.username}}</span>
          </li>
        </ul>
        <ul class="chat_others">
          <li v-for="(item,i) in userList" :key="i">
            <img :src="item.avator">
            <Badge value="自己" v-if="item.username == userInfo.username">
              <span>{{item.username}}</span>
            </Badge>
            <span v-else>{{item.username}}</span>
          </li>
        </ul>
      </div>
      <div class="chat_right">
        <div class="chat_contents">
          <p class="chat_title text_center">
            在线人数<span>({{totals}})</span>
          </p>
          <div class="chat_message">
            <div class="chat_msgs">
              <ul>
                <li v-for="(item,i) in msgs" :key="i">
                  <p class="chat_system_msg text_center" v-if="!!item.systemMsg">{{item.systemMsg}}</p>
                  <p class="chat_msgs_left" v-else-if="item.username !== userInfo.username">
                    <img class="chat_avator" :src="item.avator"/>
                    <a href="javascript:;" class="chat_username">
                      <strong>{{item.username}}</strong>
                      <span v-if="item.message">{{item.message}}</span>
                      <img class="chat_img_msg" v-else :src="item.img"/>
                    </a>
                  </p>
                  <p class="chat_msgs_right text_right" v-else>
                    <span v-if="item.message">{{item.message}}</span>
                    <img class="chat_img_msg" v-else :src="item.img"/>
                    <img class="chat_avator" :src="item.avator"/>
                  </p>
                </li>
              </ul>
            </div>
            <div class="chat_bottom" ref="chatBottom"></div>
          </div>
        </div>
        <div class="chat_send">
          <Emoji @select="selectEmoji" v-show="showEmoji" class="chat_emoji" />
          <h6>
            <i class="el-icon-picture-outline-round" @click="showEmoji = !showEmoji"></i>
            <i class="el-icon-picture" @click="$refs.fileUpload.click()"></i>
          </h6>
          <Input 
            rows='3'
            placeholder="说点什么吧!" 
            v-model="message"
            @keyup.native.enter.ctrl="sendMsg"
            type="textarea"/>
          <p class="text_right">
            <span>ctrl+enter发送</span>  
            <Button 
              :disabled="isDisable"
              size="small" 
              @click="sendMsg"
              type="primary">发送</Button>
          </p>
        </div>
      </div>
      <input 
        ref="fileUpload"
        type="file" 
        accept="image/*" 
        @change="selectImg"
        :style="{display: 'none'}">
    </div>
    <VueCanvasNest 
      :config="{color:'88,88,88', count: 88,}" 
      :el="'.chat'"/> 
  </div>
</template>

<script>
import {Badge, Input, Button, Message} from 'element-ui'
import {mapState} from 'vuex'

import Emoji from 'v-emoji-picker'
import VueCanvasNest from  'vue-canvas-nest';

export default {
  name: 'Chat',
  components: {
    Badge,
    Input,
    Button,
    Emoji,
    VueCanvasNest
  },
  data(){
    return {
      // systemMsg: [],
      msgs: [],
      message: '',
      showEmoji: false,
    }
  },
  sockets: {
    receiveMsg(data) {
      this.msgs.push(data)
      this.$nextTick(function() {
        this.$refs.chatBottom.scrollIntoView({behavior: "smooth", block: "end"})
      })
    },
    receiveHistoryMsg(datas) {
      this.msgs = datas
      this.$nextTick(function() {
        this.$refs.chatBottom.scrollIntoView({behavior: "smooth", block: "end"})
      })
    }
  },
  computed: {
    ...mapState(['userInfo', 'userList']),
    totals() {
      return this.userList.length
    },
    isDisable() {
      return !this.message.trim()
    }
  },
  created() {
    this.$socket.emit('getHistoryMsg')
  },
  methods: {
    selectImg() {
      const that = this;
      const img = this.$refs.fileUpload.files[0]
      this.$refs.fileUpload.value = null;
      var size = Math.round(img.size / 1024 / 1024);
      if(size > 2) {
        return Message.warning('图片大小不能超过2M')
      }
      const reader = new FileReader()
      reader.readAsDataURL(img)
      reader.addEventListener('load', function(){
        const data = {
          ...that.userInfo,
          img: reader.result
        }
        that.$socket.emit('sendImg', data)
      })
    },
    sendMsg() {
      if(this.isDisable) return;
      const data = {
        ...this.userInfo,
        message: this.message
      }
      this.$socket.emit('sendMsg', data)
      this.message = ''
    },
    selectEmoji(emoji) {
      // console.log(emoji)
      this.message += emoji.data;
      this.showEmoji = false;
    }
  },
}
</script>
<style lang="scss" scoped>
.chat{
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  // background-image: url('../assets/imgs/bg1.jpg');
  // background-position: center;
  // background-size: cover;
  display: flex;
  justify-content: center;
  font-size: 14px;
  .chat_container{
    width: 72%;
    height: 100vh;
    display: grid;
    grid-template-columns: 200px auto;
    >div{
      height: 100vh;
    }
    .chat_left{
      background: rgba(0, 0, 0, 0.3);
      color: white;
      li{
        display: flex;
        align-items: center;
        padding: 10px;
        img{
          margin-right: 20px;
        }
        span{
          display: inline-block;
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .chat_my_info{
        border-bottom: 1px solid #fff;
        height: 80px;
        img{
          width: 60px;
        }
      }
      .chat_others{
        height: calc(100vh - 80px);
        overflow: auto;
        li{
          height: 70px;
          span{
            display: inline-block;
            max-width: 88px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          img{
            width: 50px;
          }
        }
      }
    }
    .chat_right{
      background: #eee;
      height: 100%;
      .chat_contents{
        padding: 0 10px;
        .chat_title{
          width: 100%;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #fff;
          span{
            color: rgb(26, 161, 60);
          }
        }
        .chat_message{
          height: calc(100vh - 200px);
          overflow: auto;
          p{
            padding-top: 10px;
          }
          .chat_system_msg{
            font-size: 12px;
            color: #ccc;
          }
          .chat_msgs{
            width: 100%;
            li {
              width: 100%;
              margin-bottom: 10px;
              .chat_avator{
                width: 40px;
                height: 40px;
              }
              .chat_username{
                position: relative;
                color: #888;
                strong{
                  position: absolute;
                  left: 0;
                  top: -25px;
                  font-size: 12px;
                  max-width: 100px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                >span{
                  color: #333;
                  margin-top: 18px;
                }
                .chat_img_msg{
                  margin-top: 18px;
                }
              }
              .chat_img_msg{
                max-width: 100px;
                max-height: 150px;
                vertical-align: top;
              }
              .chat_msgs_left .chat_avator{
                margin-right: 12px;
              }
              .chat_msgs_right .chat_avator{
                margin-left: 12px;
              }
              span{
                vertical-align: top;
                display: inline-block;
                max-width: 60%;
                border-radius: 4px;
                padding: 5px;
                position: relative;
                &::before{
                  content: '';
                  position: absolute;
                  top: 50%;
                  width: 0;
                  height: 0;
                  border: 6px solid;
                }
              }
              .chat_msgs_left span{
                background: #fff;
                &::before{
                  left: 0;
                  border-color: transparent #fff transparent  transparent;
                  transform: translate(-100%, -50%);
                }
              }
              .chat_msgs_right span{
                background: yellow;
                &::before{
                  right: 0;
                  border-color: transparent transparent  transparent yellow;
                  transform: translate(100%, -50%);
                }
              }
            }
          }
          .chat_bottom{
            height: 0;
          }
        }
      }
      .chat_send{
        padding: 0 10px;
        height: 150px;
        border-top: 1px solid #fff;
        position: relative;
        .chat_emoji{
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          transform: translateY(-100%);
           /deep/ .container-emoji{
            height: 150px;
          }
        }
        h6{
          height: 30px;
          font-size: 16px;
          padding-left: 10px;
          display: flex;
          align-items: center;
          i{
            cursor: pointer;
            margin-right: 5px;
          }
        }
        p{
          position: absolute;
          right: 10px;
          bottom: 5px;
          span{
            color: #888;
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
