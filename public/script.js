var canW = 1220;
var canH = 420;
var canX = 10;
var canY = 30;
var notes = ["C", "D", "E", "F", "G", "A", "B"];
var keyboard = [];
var tracks = [];
var whiteHeight = 60;
var blackHeight = whiteHeight / 2;
var whiteWidth = 100;
var blackWidth = 0.55 * whiteWidth;
var colours = [255, 255, 255];
var colour = "";
var templates = [];

var myMelody = new Melody([]);
let snappedMelody = new Melody([]);
var snapped = false;
var mySection = 0;

//client IDs of the clients that this device is connected to
var partners = { top: null, bottom: null, right: null, left: null };

// ip address of device hosting the server
const ip = "10.0.1.131";

var synth = new Tone.PolySynth().toDestination();

document.getElementById("start").addEventListener("click", function () {
  if (Tone.context.state != "running") {
    Tone.start();
  }
});

function getMelody(isSnapped = false) {
  if (isSnapped) {
    return snappedMelody;
  } else {
    return myMelody;
  }
}
function getSongSection() {
  return mySection;
}
function setSongSection(n) {
  mySection = n;
}
function update(n, newMelody) {
  setSongSection(n);
  snappedMelody = reconstructMelody(newMelody);
}

function setSynth(instrument) {
  let format;
  if (instrument == "piano"){
    format = ".mp3";
  } else {
    format = ".wav";
  }
  synth = new Tone.Sampler({
    urls: {
      C4: instrument + "_C3" + format,
      D4: instrument + "_D3" + format,
      E4: instrument + "_E3" + format,
      F4: instrument + "_F3" + format,
      G4: instrument + "_G3" + format,
      A4: instrument + "_A3" + format,
      B4: instrument + "_B3" + format,
    },
   // Must switch out ip address when needed
    baseUrl: "https://" + ip + ":3000/audio/" + instrument + "/",
    onload: () => {
      sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
    }
  }).toDestination();
}

function getIcon(value) {
  if (value == "piano") {
    var imageString = `<image src="instrument_icons/piano.svg" class="instrument"></image>`;
    colours[0] = 255;
    colours[1] = 204;
    colours[2] = 0;
  } else if (value == "guitar") {
    var imageString = `<image src="instrument_icons/electric-guitar.svg" class="instrument"></image>`;
    colours[0] = 255;
    colours[1] = 0;
    colours[2] = 0;
  } else if (value == "bells") {
    var imageString = `<image src="instrument_icons/bells.svg" class="instrument"></image>`;
    colours[0] = 255;
    colours[1] = 192;
    colours[2] = 203;
  }
  setSynth(value);
  document.getElementById("icon").innerHTML = imageString;
  colour =
    `rgb(` +
    colours[0].toString() +
    `,` +
    colours[1].toString() +
    `,` +
    colours[2].toString() +
    `)`;
  colourcheck();
}
function colourcheck() {
  var playbtn = document.getElementById("playBTN");
  playbtn.classList.remove("play");
  if (colour == "rgb(255,204,0)") {
    playbtn.classList.add("yellow");
  }
  if (colour == "rgb(255,0,0)") {
    playbtn.classList.add("red");
  }
  if (colour == "rgb(255,192,203)") {
    playbtn.classList.add("pink");
  } else {
    playbtn.classList.add("play");
  }
}
function setup() {
  createCanvas(canW + 10, canH + 200);
  strokeWeight(5);
  stroke("black");
  rect(canX - 2, canY - 2, canW, canH + 5);
  var j = 0;
  for (var i = notes.length - 1; i >= 0; i--) {
    var note = notes[j];
    keyboard.push(new whiteNote(note, canX, canY + i * whiteHeight));
    if (note != "E" && note != "B") {
      keyboard.push(
        new blackNote(note, canX, canY + i * whiteHeight - blackHeight / 2)
      );
    }
    j++;
  }
  for (var i = 0; i < keyboard.length; i++) {
    var key = keyboard[i];
    var note = key.note;
    // when only using white tracks
    if (!note.includes("#")) {
      tracks.push(new whiteTrack(canW, key));
    }

    /*
    if (note == "C" || note == "F") {
      tracks.push(new wideTrack(key.y + 0.25 * key.h, canW, key));
    } else if (note == "E" || note == "B") {
      tracks.push(new wideTrack(key.y, canW, key));
    } else if (note == "D" || note == "G" || note == "A") {
      tracks.push(new whiteTrack(canW, key));
    } else {
      tracks.push(new blackTrack(canW, key));
    }
    */
  }
  templates.push(
    new templateNote(null, 400, 500, canW - whiteWidth - 5, 2, 8, colours)
  );
  templates.push(
    new templateNote(null, 400, 550, canW - whiteWidth - 5, 2, 4, colours)
  );
  templates.push(
    new templateNote(null, 600, 500, canW - whiteWidth - 5, 2, 2, colours)
  );
  templates.push(
    new templateNote(null, 600, 550, canW - whiteWidth - 5, 2, 1, colours)
  );
}
function draw() {
  background(255);
  displayBoard(keyboard, tracks, canX, canY, canW, canH);
  barLines(canX + whiteWidth, canY, canW - whiteWidth - 5, canH, 2);
  displayNotes(templates);
  displayNotes(myMelody.notes);
}

function mousePressed() {
  for (var tNote of templates) {
    tNote.clicked();
  }
  for (var note of myMelody.notes) {
    note.clicked();
  }
}
function mouseReleased() {
  for (var tNote of templates) {
    createNote(tracks, tNote, myMelody, colours);
    tNote.released();
  }
  for (var note of myMelody.notes) {
    note.setBeat(tracks);
    note.setNote(tracks);
    myMelody.setScore();
    note.released();
  }
}
function touchStarted() {
  for (var tNote of templates) {
    tNote.clicked();
  }
  for (var note of myMelody.notes) {
    note.clicked();
  }
}
function touchEnded() {
  for (var tNote of templates) {
    createNote(tracks, tNote, myMelody, colours);
    tNote.released();
  }
  for (var note of myMelody.notes) {
    note.setBeat(tracks);
    note.setNote(tracks);
    myMelody.setScore();
    note.released();
  }
}
synth.sync();
Tone.Transport.start();
