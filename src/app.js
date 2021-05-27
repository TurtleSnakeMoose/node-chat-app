const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const path = require('path')
const Filter = require('bad-words')

const _log = require('./common/log')
const {buildMessageObject, buildLocationMessageObject} = require('./utils/message')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const publicDir = path.join(__dirname, '../public');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(publicDir))
app.use(express.json())

io.on('connection', socket => {
    _log.misc('New webSocket connection!')

    // socket.emit => emits event to this specific socket
    // io.emit => emit event to all sockets
    // socket.broadcast.emit => emits event to all sockets but this one
    // io.to.emit => emit event to everyone in a given room
    // socket.broadcast.to.emit => emit event to everyone but this socket at a given room
    
    socket.on('join', (data, callback) => {
        const {error, user} = addUser({ ...data, id: socket.id })
        if (error) {
            return callback(error);
        }

        socket.join(user.room)

        socket.emit('msg', buildMessageObject('Welcome to the conversation!'))
        socket.broadcast.to(user.room).emit('msg', buildMessageObject(`${user.username} has join the room ${user.room}`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter;
        const user = getUser(socket.id)
        
        if (!user) {
            return callback('Something went wrong with your session')
        }
        
        if (filter.isProfane(msg)) {
            return callback('this message contains profanity. not sent.');
        }

        io.to(user.room).emit('msg',buildMessageObject(msg, user.username));
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        if (!user) {
            return callback('Something went wrong with your session')
        }

        io.to(user.room).emit('locationMsg', buildLocationMessageObject(`https://google.com/maps?q=${coords.lat},${coords.long}`, user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('msg', buildMessageObject(`${user.username} has left the conversation!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
})

server.listen( process.env.PORT , () => {
    _log.success(' SUCCESS ',`Server is up and running on port ${process.env.PORT}!`)
})

module.exports = app