import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from 'http'

const port = '3000';
const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors:{
        // origin:'*'  // If want to allow cors for every one
        origin :'http://localhost:5173', //for specific one
        methods:['GET', 'POST'],
        credentials:true,  
    }
})

app.get('/', (req,res)=>{
    res.send('<h1>hello, world</h1>')
})

io.on('connection', (socket) =>{
    console.log("user connected", socket.id);

    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('received-message', data) // due to broadcast this message will sended to all other client in the server except to who is sending
        // io.broadcast.emit('received-message', data)  //  this will send to everyone including who is sending
    })
    // console.log("id" , socket.id);

    // socket.emit('welcome', `welcome to the server`);
    // socket.broadcast.emit('welcome', `${socket.id} has joined the server`) // due to broadcast this message will sended to all other client in the server except to him

    socket.on('disconnect',()=>{
        console.log('user disconnected', socket.id);
        
    } )
    
})

server.listen(port, ()=>{
    console.log(`server is running on port:${port}`)
})