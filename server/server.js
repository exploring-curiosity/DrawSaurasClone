const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');
var app = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection',(socket)=>{
    console.log('user Online');

    socket.on('canvas-data',(data)=>{
        socket.broadcast.emit('canvas-data',data);
    })
})

var port = process.env.PORT || 5000;

http.listen(port,()=>{
    console.log("listening : ",port);
})
