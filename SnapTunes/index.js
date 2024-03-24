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
let IDs = [];
let songSections = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('Vsnap',(data)=>{
        let {melody, id, songSection} = data;
        IDs.push(id);
        songSections.push(songSection);
        // IDs[0] is top, IDs[1] is bottom
        melodies.push(melody);
        if (melodies.length == 2){
            io.to(IDs[0]).emit('Vsnap',{Melodies:melodies, otherSection:songSections[1],isTop:true});
            io.to(IDs[1]).emit('Vsnap',{Melodies:melodies, otherSection:songSections[0],isTop:false});
            io.to(IDs[0]).emit('Bottom',IDs[1]);
            io.to(IDs[1]).emit('Top', IDs[0]);
            melodies = [];
            IDs = [];
            songSections = [];
        }
    });
    socket.on('Hsnap',(data)=>{
        let {melody, id, songSection} = data;
        IDs.push(id);
        songSections.push(songSection);
        // IDs[0] is left, IDs[1] is right
        melodies.push(melody);
        if (melodies.length == 2){
            io.to(IDs[0]).emit('Hsnap',{Melodies:melodies, otherSection:songSections[1],isLeft:true});
            io.to(IDs[1]).emit('Hsnap',{Melodies:melodies, otherSection:songSections[0],isLeft:false});
            io.to(IDs[0]).emit('Right',IDs[1]);
            io.to(IDs[1]).emit('Left', IDs[0]);
            melodies = [];
            IDs = [];
            songSections = [];
        }
    });
    socket.on('Update',(data)=>{
        let {sender, recipient, partner, newSection, newMelody} = data;
        // if partner is top or bottom, newSection can stay the same
        if (partner=='right'){
            newSection = newSection + 1;
        }
        else if (partner =='left'){
            newSection = newSection - 1;
        }
        io.to(recipient).emit('Update',{senderID: sender, newSection:newSection, newMelody:newMelody});
    });
    socket.on('disconnect',() => {
        console.log('user disconnected');
    });
});

server.listen(3000,() => {
    console.log('listening on *:3000');
});