const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

var dbUrl = 'mongodb://localhost:27017/simple-chat'

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if(err) {
            res.sendStatus(500)
        }
        io.emit('message', req.body)
        res.sendStatus(200)
    })
})

io.on('connection', () => {
    console.log('a user is connected')
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    console.log('mongodb connected', err)
})
var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port)
})