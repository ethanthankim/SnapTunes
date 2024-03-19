/* --- FUNCTIONS ---------------------------------------------------*/

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
  function inTrack(track, note) {
    // returns true if note is within the track
    return (
      note.x >= track.x &&
      note.x + note.w <= track.x + track.w &&
      note.y >= track.y &&
      note.y + note.h <= track.y + track.h
    );
  }
  function setBeat(tracks, note) {
    // tracks is array of tracks
    // width is the width of a single track
    // height is the height of one track * number of tracks
    var increment = tracks[0].w / 16;
    var bar = 0;
    var beat = 0;
    for (var i = 0; i < 16; i++) {
      if (i == 8) {
        bar = 1;
        beat = 0;
      }
      if (
        note.x >= tracks[0].x + i * increment &&
        note.x <= tracks[0].x + (i + 1) * increment
      ) {
        note.beat = bar.toString() + ":" + beat.toString();
      }
      beat = beat + 0.5;
    }
  }
  function setNote(tracks, note) {
    for (var track of tracks) {
      if (inTrack(track, note)) {
        note.note = track.note;
      }
    }
  }
  function createNote(tracks, tNote, melody, colours) {
    for (var i = 0; i < tracks.length; i++) {
      if (inTrack(tracks[i], tNote)) {
        var newNote = new timeNote(
          tracks[i].note,
          tNote.x,
          tNote.y,
          tracks[i].w,
          tNote.bars,
          tNote.type,
          colours
        );
        melody.push(newNote);
        return newNote;
      }
    }
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
function shiftMelody(melody) {
  // melody is array of Notes
  // shift will return new melody in which each note's beat is shifted by two bars
  // note.beat is a string "bar:beat"
  let newMelody = [];
  console.log(melody);
  for (note of melody) {
    var currentBeat = note.beat;
    var newBar = parseInt(currentBeat[0]) + 2;
    var newNote = new timeNote(note.note.slice(0,note.note.length-1),0,0,0,0,note.type,[]);
    newNote.beat = newBar.toString() + ':' + currentBeat[currentBeat.length-1];
    newMelody.push(newNote);
  }
  console.log(newMelody);
  return newMelody;
}