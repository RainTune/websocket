const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
// const socket = require('socket.io')
// const io = socket(server)
const initSocket = require('./socket/index.js')

const Port = 3000
server.listen(Port, () => {
  console.log(`Server is running at ${Port} port`)
})

initSocket(server)

