import { Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  // const socket =  io('http://localhost:3000')
  const [message, setMessage] = useState("");
  const [name,setName]= useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { name, message });
    setMessage("");
    // setName('')
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on('received-message', (data)=>{
      console.log(`message received from: ${data.name} :`,data.message);
      
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
      <form onSubmit={handleSubmit}>
      <TextField
          value={name}
          id="name"
          label="name"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          value={message}
          id="outlined-basic"
          label="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send{" "}
        </Button>
      </form>
    </Container>
  );
};

export default App;
