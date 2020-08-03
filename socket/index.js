const socketIo = require('socket.io')

const {MessageModel} = require('../db/index.js')

function saveMsg(msg,callback) {
  new MessageModel(msg).save(err => {
    if(err) {
      return console.log(err)
    }
    callback ? callback() : console.log('save success')
  })
}
function getHistoryMsg(callback) {
  MessageModel.find({}, function(err, docs) {
    if(err) {
      return console.log(err)
    }
    callback ? callback(docs) : console.log(docs)
  })
}
const users = []
let count = 0;
module.exports =  function initSocket(server) {
  const io = socketIo(server)

  io.on('connection', (socket) => {
    count++;
    console.log(`第${count}个用户连接上`)
    // console.log(io.sockets)
    socket.on('disconnect', () => {
      count--;
      console.log('用户离开了')
      let idx = users.findIndex(item => item.username == socket.username)
      if(idx > -1) {
        users.splice(idx, 1)
        const messageInfo = {
          username: socket.username,
          avator: socket.avator,
          systemMsg: `${socket.username} 离开了`
        }
        saveMsg(messageInfo, () => {
          io.emit('receiveMsg', messageInfo)
          io.emit('updateUsers', users)
        })
      }
    })
    socket.on('login', data => {
      console.log(data)
      let user = users.find(item => item.username == data.username)
      if(user) {
        socket.emit('loginError', {msg: '用户已存在'})
      }else {
        users.push(data)
        socket.username = data.username
        socket.avator = data.avator
        socket.emit('loginSuccess', data)
        io.emit('updateUsers', users)
        const messageInfo =  {
          ...data,
          systemMsg: `${data.username} 进来了`
        }
        saveMsg(messageInfo, () => io.emit('receiveMsg', messageInfo))
      }
    })
    socket.on('sendMsg',function(data) {
      saveMsg(data, () =>  io.emit('receiveMsg', data))
    })
    socket.on('sendImg',function(data) {
      saveMsg(data, () => io.emit('receiveMsg', data))
    })
    socket.on('getHistoryMsg', function() {
      getHistoryMsg((datas) => socket.emit('receiveHistoryMsg', datas))
    })
  })
}