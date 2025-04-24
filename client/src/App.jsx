import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  // const socket =  io('http://localhost:3000')
  const [message, setMessage] = useState("");
  const [name,setName]= useState('')
  const [room,setRoom]= useState('')
  const [socketID,setSocketId]= useState('')
  const [showMessages, setShowMessages] = useState([])
  const [roomName, setRoomName] = useState('')
  const [joinMessage, setJoinMessage]=useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { name, message, room });
    setMessage("");
    // setName('')
  };

  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit('join-room', roomName)
    setJoinMessage(`you have joined ${roomName} room`)
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id);
    });

    socket.on('received-message', (data)=>{
      setShowMessages((showMessages)=>[...showMessages,data])
      console.log(`new message from`,{data});
      
    })

    // socket.on('welcome', (msg)=>{
    //   console.log(msg);
    // });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>
      <Typography>{socketID}</Typography>
      <form onSubmit={joinRoomHandler}>
      <TextField
          value={roomName}
          id="roomName"
          label="Room Name"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Join{" "}
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
      <TextField
          value={name}
          id="name"
          label="name"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          value={message}
          id="message"
          label="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          value={room}
          id="room"
          label="room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send{" "}
        </Button>
      </form>
     <Typography>{joinMessage}</Typography> 
      <Stack>
      {
        showMessages.map((msg, index)=>
          (
            <Typography variant="p" key={index}>message from {msg.name} : {msg.message}</Typography>
          )
        )
      }
      </Stack>
    </Container>
  );
};

export default App;
