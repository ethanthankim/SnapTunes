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
var templates = [];
var melody = [];
var colours = [255, 255, 255];
var startBTN = document.getElementById("start");
var synth = new Tone.PolySynth().toDestination();

startBTN.addEventListener("click", function () {
  if (Tone.context.state != "running") {
    Tone.start();
  }
});

function getIcon(value) {
  if (value == "piano") {
    var imageString = `<image src="instrument_icons/piano.png" class="instrument"></image>`;
    colours[0] = 255;
    colours[1] = 204;
    colours[2] = 0;
  } else if (value == "guitar") {
    var imageString = `<image src="instrument_icons/guitar.png" class="instrument"></image>`;
    colours[0] = 255;
    colours[1] = 0;
    colours[2] = 0;
  } else if (value == "bells") {
    var imageString = `<image src="instrument_icons/bells.png" class="instrument"></image>`;
    colours[0] = 255;
    colours[1] = 192;
    colours[2] = 203;
  }
  document.getElementById("icon").innerHTML = imageString;
  var colour =
    `rgb(` +
    colours[0].toString() +
    `,` +
    colours[1].toString() +
    `,` +
    colours[2].toString() +
    `)`;
  var playbtn = document.getElementById("playBTN");
  playbtn.style.backgroundColor = colour;
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
  displayNotes(melody);
}

function mousePressed() {
  for (var tNote of templates) {
    tNote.clicked();
  }
  for (var note of melody) {
    note.clicked();
  }
}
function mouseReleased() {
  for (var tNote of templates) {
    createNote(tracks, tNote, melody, colours);
    tNote.released();
  }
  for (var note of melody) {
    setBeat(tracks, note);
    setNote(tracks, note);
    note.released();
  }
}
synth.sync();
Tone.Transport.start();

function playMelody() {
  let score = [];
  for (var note of melody) {
    score.push({ time: note.beat, note: note.note, type: note.value });
  }
  section = new Tone.Part((time, section) => {
    synth.triggerAttackRelease(section.note, section.type, time);
  }, score);
  // start the transport to hear the notes
  section.start();
  switchButtons(true);
  setTimeout(function () {
    switchButtons(false);
  }, 5000);
}

function switchButtons(isPlaying) {
  var button = document.getElementById("playBTN");
  if (isPlaying) {
    button.setAttribute(`onclick`, `section.stop(); switchButtons(false)`);
    button.innerHTML = "Stop";
  } else {
    button.setAttribute(`onclick`, `playMelody(); switchButtons(true)`);
    button.innerHTML = "Play";
  }
}