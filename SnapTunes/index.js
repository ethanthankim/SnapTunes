const express= require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

let melodies = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('Vsnap',(melody)=>{
        melodies.push(melody);
        if (melodies.length == 2){
            io.emit('Vsnap',melodies);
            melodies = [];
        }
    });
    // socket.on('Hsnap',(melody)=>{
    //     io.emit('Hsnap',constructMelody(melody,true));
    // });
    socket.on('disconnect',() => {
        console.log('user disconnected');
    });
});

server.listen(3000,() => {
    console.log('listening on *:3000');
});