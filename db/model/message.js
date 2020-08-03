const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new Schema({
  username: String,
  avator: String,
  message: String,
  img: String,
  systemMsg: String
})

const MessageModel = mongoose.model('Message', messageSchema)

module.exports = MessageModel