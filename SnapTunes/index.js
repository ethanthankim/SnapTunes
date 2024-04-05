const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require("path");

app.use("/audio", express.static(path.join(__dirname, "public", "audio")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/title.html"));
});

app.use(express.static("public"));

let melodies = [];
let swipes = { top: null, bottom: null, left: null, right: null };

// Remove any swipes older than a second
setInterval(() => {
  swipes = { top: null, bottom: null, left: null, right: null };
}, 1000);

io.on("connection", (socket) => {
  console.log("a user connected");
  // socket.on('Vsnap',(data)=>{
  //     let {melody, id, songSection} = data;
  //     // IDs[0] is top, IDs[1] is bottom
  //     IDs.push(id);
  //     songSections.push(songSection);
  //     melodies.push(melody);
  //     if (melodies.length == 2){
  //         io.to(IDs[0]).emit('Vsnap',{Melodies:melodies, otherSection:songSections[1],isTop:true});
  //         io.to(IDs[1]).emit('Vsnap',{Melodies:melodies, otherSection:songSections[0],isTop:false});
  //         io.to(IDs[0]).emit('Bottom',IDs[1]);
  //         io.to(IDs[1]).emit('Top', IDs[0]);
  //         melodies = [];
  //         IDs = [];
  //         songSections = [];
  //     }
  // });
  // socket.on('Hsnap',(data)=>{
  //     let {melody, id, songSection} = data;
  //     IDs.push(id);
  //     songSections.push(songSection);
  //     // IDs[0] is left, IDs[1] is right
  //     melodies.push(melody);
  //     if (melodies.length == 2){
  //         io.to(IDs[0]).emit('Hsnap',{Melodies:melodies, otherSection:songSections[1],isLeft:true});
  //         io.to(IDs[1]).emit('Hsnap',{Melodies:melodies, otherSection:songSections[0],isLeft:false});
  //         io.to(IDs[0]).emit('Right',IDs[1]);
  //         io.to(IDs[1]).emit('Left', IDs[0]);
  //         melodies = [];
  //         IDs = [];
  //         songSections = [];
  //     }
  // });
  socket.on("Update", (data) => {
    let { sender, recipient, partner, newSection, newMelody, senderMelody } =
      data;
    // if partner is top or bottom, newSection can stay the same
    if (partner == "right") {
      newSection = newSection + 1;
    } else if (partner == "left") {
      newSection = newSection - 1;
    }
    io.to(recipient).emit("Update", {
      senderID: sender,
      newSection: newSection,
      newMelody: newMelody,
    });
  });
  // socket.on('Unsnap',(data)=>{
  //     unsnapPair.push(data);
  //     if (unsnapPair.length == 2){
  //         let recipient1 = unsnapPair[0].recipient;
  //         let recipient2 = unsnapPair[1].recipient;
  //         let sender1 = unsnapPair[0].id;
  //         let sender2 = unsnapPair[1].id;
  //         let side1 = unsnapPair[0].side;
  //         let side2 = unsnapPair[1].side;
  //         if (recipient1==sender2 && recipient2 == sender1){
  //             io.to(recipient1).emit('Unsnap', {formerPartner:sender1,mySide:side2});
  //             io.to(recipient2).emit('Unsnap', {formerPartner:sender2,mySide:side1});
  //         }
  //         unsnapPair = [];
  //     };
  // });
  // socket.on('Resnap', (data)=>{
  //     let {id,partners,melody,side,section,total} = data;
  //     groups[side].push({id:id,melody:melody,section:section});
  //     console.log(groups,groups.top.length,groups.bottom.length,total);
  //     if (groups['top'].length + groups['bottom'].length >= total) {
  //         // delete the topGroup melodies from bottomGroup and vice versa
  //         console.log(groups);
  //         for (var topDevice of groups['top']){
  //             for (var bottomDevice of groups['bottom']){
  //                 io.to(bottomDevice.id).emit('Remove',{melody:topDevice.melody,section:topDevice.section});
  //                 io.to(topDevice.id).emit('Remove',{melody:bottomDevice.melody,section:bottomDevice.section});
  //             }
  //         }
  //         groups['top'] = [];
  //         groups['bottom'] = [];
  //     }
  //     else if (groups['left'].length + groups['right'].length == total) {
  //         // delete the leftGroup melodies from rightGroup and vice versa
  //         console.log(groups);
  //         for (var leftDevice of groups['left']){
  //             for (var rightDevice of groups['right']){
  //                 io.to(leftDevice.id).emit('Remove',{melody:leftDevice.melody,section:leftDevice.section});
  //                 io.to(rightDevice.id).emit('Remove',{melody:rightDevice.melody,section:rightDevice.section});
  //             }
  //         }
  //         groups['left'] = [];
  //         groups['right'] = [];
  //     }
  //     else {
  //         //request info from the partners
  //         console.log(side,partners);
  //         for (var partner in partners){
  //             var partnerID = partners[partner];
  //             if (partnerID != null) {
  //                 // check if its already in groups
  //                 var counted = false;
  //                 for (var p of groups[side]){
  //                     if (p.id == partnerID){
  //                         counted = true;
  //                         break;
  //                     }
  //                 }
  //                 if (counted) {continue;}
  //                 io.to(partnerID).emit('Resnap',side);
  //             }
  //         }
  //     }
  // });
  socket.on("Snap", (data) => {
    let { melody, id, songSection, partners, swipe } = data;
    // check if the device already has a partner in that direction
    if (partners[swipe] == null) {
      swipes[swipe] = { melody: melody, id: id, songSection: songSection };
    }
    if (swipes["top"] != null && swipes["bottom"] != null) {
      // The device on top was the one that had the bottom swipe
      let bottom = swipes["top"];
      let top = swipes["bottom"];
      melodies.push(top.melody);
      melodies.push(bottom.melody);
      io.to(top.id).emit("Vsnap", {
        Melodies: melodies,
        otherSection: bottom.songSection,
        isTop: true,
      });
      io.to(bottom.id).emit("Vsnap", {
        Melodies: melodies,
        otherSection: top.songSection,
        isTop: false,
      });
      io.to(top.id).emit("Bottom", bottom.id);
      io.to(bottom.id).emit("Top", top.id);
    }
    if (swipes["left"] != null && swipes["right"] != null) {
      let right = swipes["left"];
      let left = swipes["right"];
      melodies.push(left.melody);
      melodies.push(right.melody);
      io.to(left.id).emit("Hsnap", {
        Melodies: melodies,
        otherSection: right.songSection,
        isLeft: true,
      });
      io.to(right.id).emit("Hsnap", {
        Melodies: melodies,
        otherSection: left.songSection,
        isLeft: false,
      });
      io.to(left.id).emit("Right", right.id);
      io.to(right.id).emit("Left", left.id);
    }
    melodies = [];
  });
  socket.on("Reset", () => {
    io.emit("Reset");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
