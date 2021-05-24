var express = require('express');
var http = require('http');
var socketio = require('socket.io');
const cors = require('cors');
const {addUser,removeUser,getUser,getUsersInRoom} = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());


io.on('connection',(socket)=>{
    socket.on('canvas-data',(data)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('canvas-data',data);
    });
    socket.on('join',({name,room},callback)=>{
        const {error,user}= addUser({id:socket.id,name,room});
        if(error) return callback(error);
        // socket.emit('message',{user:'admin',text:`${user.name},welcome to the room ${user.room}`});
        // socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name}, has joined`})
        socket.join(user.room);
        callback();
    });
    socket.on('disconnect',()=>{
        const user= removeUser(socket.id);
        // if(user){
        //     io.to(user.room).emit('message',{user:'admin',text:`${user.name}, has left`});
        // }
    });
})

server.listen(PORT,()=>{
    console.log('Server started on port: ',PORT);
});
