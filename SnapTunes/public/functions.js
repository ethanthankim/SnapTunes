/* --- functions.js ---------------------------------------------------*/

function barLines(x, y, width, height, bars) {
    eighth = width / (bars * 8);
    for (var i = 1; i < 16; i++) {
      if (i % 8 == 0) {
        stroke("black");
        strokeWeight(5);
      } else if (i % 2 == 0) {
        stroke(90, 90, 90);
        strokeWeight(2);
      } else {
        stroke("grey");
        strokeWeight(1);
      }
      line(x + i * eighth, y, x + i * eighth, y + height);
    }
  }
  function displayBoard(keyboard, tracks, x, y, width, height) {
    strokeWeight(5);
    stroke("black");
    fill(255, 255, 255, 0);
    rect(x - 2, y - 2, width, height + 5);
    textSize(16);
    for (var i = 0; i < keyboard.length; i++) {
      var key = keyboard[i];
      key.show();
      if (key.note.includes("#")) {
        fill("white");
        text(key.note, key.x + key.w / 2, key.y + key.h / 2);
      } else {
        fill("black");
        text(key.note, key.x + key.w * (3 / 4), key.y + key.h / 2);
      }
    }
    for (var j = 0; j < tracks.length; j++) {
      tracks[j].show();
    }
  }
  function displayNotes(notesList) {
    for (var i = 0; i < notesList.length; i++) {
      var note = notesList[i];
      note.update();
      note.over();
      note.show();
    }
  }
  function createNote(tracks, tNote, melody, colours) {
    // melody is of class Melody
    for (var i = 0; i < tracks.length; i++) {
      if (tNote.inTrack(tracks[i])) {
        var newNote = new timeNote(
          tracks[i].note,
          tNote.x,
          tNote.y,
          tracks[i].w,
          tNote.bars,
          tNote.type,
          colours
        );
        newNote.setBeat(tracks);
        melody.addNote(newNote);
      }
    }
  }
function switchButtons(isPlaying) {
  var button = document.getElementById("playBTN");
  if (isPlaying) {
    button.setAttribute(`onclick`, `section.stop(); switchButtons(false)`);
    button.innerHTML = "Stop";
  } else{
    button.setAttribute(`onclick`, `playMelody(myMelody, snappedMelody, snapped);switchButtons(true)`);
    button.innerHTML = "Play";
  }
}
function constructMelody(melodies, isHorizontal) {
  // melodies is array of two melody objects
  // [{notes:[...], score:[...], length:1} , {notes:[...], score:[...], length:1}]
  // reconstruct melody must first be called on each melody's notes attribute
  // function to be called when one snap occurs
  // isHorizontal is bool - true when horizontal, false when vertical
  // melody[0] will be left tablet, melody[1] will be right

  let newMelody;
  if (isHorizontal) {
    newMelody = new Melody(melodies[0].notes);
    let secondMelody = shiftMelody(melodies[1]);
    newMelody.addMelody(secondMelody);
    newMelody.length = melodies[0].length + melodies[1].length;
    return newMelody;
  }
  else {
    newMelody = reconstructMelody(melodies[0].notes);
    newMelody.addMelody(reconstructMelody(melodies[1].notes));
    return newMelody;
  }
}
function reconstructMelody(melody) {
  // when melody gets sent from server to client, it loses its attributes as a custom class so it must be reconstructed on the client side
  // melody will be of the form [{note:"C",....},{note:"D"...}] an array of objects that contain the data of the notes but not the methods
  let reconstructedNotes = [];
  for (var note of melody) {
    // call the simple constructor of timeNote
    reconstructedNotes.push(new timeNote(note.note,note.type,note.bar,note.beat));
  }
  let reconstructed = new Melody(reconstructedNotes);
  return reconstructed;
}
function playMelody(myMelody,snappedMelody=[],isSnapped=false) {
  let melody;
  if (isSnapped){
    melody = snappedMelody;
  }
  else {
    melody = myMelody;
  }
  section = new Tone.Part((time, section) => {
    synth.triggerAttackRelease(section.note, section.type, time);
  }, melody.score);
  // start the transport to hear the notes
  section.start();
  switchButtons(true);
  setTimeout(function () {
    switchButtons(false);
  }, melody.length*5000);
}

function shiftMelody(melody) {
  // melody is of class Melody
  // shift will return new melody in which each note's beat is shifted by two bars
  // note.beat is a string "bar:beat"
  let newNotes = [];
  for (note of melody.notes) {
    var currentBeat = note.beat;
    var newBar = parseInt(currentBeat[0]) + 2;
    var newNote = new timeNote(note.note.slice(0,note.note.length-1),0,0,0,0,note.type,[]);
    newNote.beat = newBar.toString() + ':' + currentBeat[currentBeat.length-1];
    newNotes.push(newNote);
  }
  return new Melody(newNotes);
}
