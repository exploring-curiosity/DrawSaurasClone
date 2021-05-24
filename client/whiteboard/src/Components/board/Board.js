import React, { useState,useEffect } from 'react';
import './board.css';
import io from 'socket.io-client';
import queryString from 'query-string';
let socket;
const Board=(props)=> {
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [flag,setFlag] = useState(true);
    const [ctx,setctx] = useState();
    const [timeout,settimeOut] = useState();
    
    
    const ENDPOINT = 'http://localhost:5000/';
    useEffect(()=>{
        const {name,room} =queryString.parse(window.location.search);
        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        };
        socket = io(ENDPOINT,connectionOptions);
        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},()=>{
        });
        socket.on("canvas-data",function(data){
            var image= new Image();
            var canvas= document.querySelector('#board');
            var ctx = canvas.getContext('2d');
            image.onload=function(){
                ctx.drawImage(image,0,0);
            };
            image.src = data;
        })
        return () =>{
            // socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT]);
    // socket.on("canvas-data",function(data){
    //     var image= new Image();
    //     var canvas= document.querySelector('#board');
    //     var ctx = canvas.getContext('2d');
    //     image.onload=function(){
    //         ctx.drawImage(image,0,0);
    //     };
    //     image.src = data;
    // })
    useEffect(()=>{
        if(flag===true) return;
        ctx.strokeStyle = props.color;
        ctx.lineWidth = props.size;
    },[props,flag,ctx]);
    
    useEffect(()=>{
        var canvas = document.querySelector('#board');
        const drawOnCanvas=(canvas)=>{
            setFlag('false');
            var ctx = canvas.getContext('2d');
            setctx(ctx);
            var sketch = document.querySelector('#sketch');
            var sketch_style = getComputedStyle(sketch);
            canvas.width = parseInt(sketch_style.getPropertyValue('width'));
            canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    
            var mouse = {x: 0, y: 0};
            var last_mouse = {x: 0, y: 0};
    
            /* Mouse Capturing Work */
            canvas.addEventListener('mousemove', function(e) {
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;
    
                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;
            }, false);
    
    
            /* Drawing on Paint App */
            ctx.lineWidth = props.size;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = props.color;
    
            canvas.addEventListener('mousedown', function(e) {
                canvas.addEventListener('mousemove', onPaint, false);
            }, false);
    
            canvas.addEventListener('mouseup', function() {
                canvas.removeEventListener('mousemove', onPaint, false);
            }, false);
    
            var onPaint = function() {
                ctx.beginPath();
                ctx.moveTo(last_mouse.x, last_mouse.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.closePath();
                ctx.stroke();
                if(timeout!==undefined) clearTimeout(timeout);
                settimeOut(setTimeout(function(){
                    var base64ImageData = canvas.toDataURL("image/png");
                    socket.emit("canvas-data",base64ImageData);
                },100));
            };
        }
        drawOnCanvas(canvas);
    },[])
    return (  
            <div className='sketch' id='sketch'>
            <canvas className='board' id='board'></canvas>
            </div>
        );
}
 
export default Board;