const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/websocker');

const MessageModel = require('./model/message.js')
const db = mongoose.connection
db.on('error', function() {
  console.log('connect error')
})
db.once('open', function() {
  console.log('connect open!')
})
db.once('connected', function() {
  console.log('db connected!')
})
db.once('disconnected', function() {
  console.log('db disconnected!')
})

module.exports = {
  MessageModel
}