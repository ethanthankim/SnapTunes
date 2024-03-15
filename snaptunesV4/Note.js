var whiteNoteHeight = 60;
var blackNoteHeight = whiteNoteHeight / 2;
var whiteNoteWidth = 100;
var blackNoteWidth = 0.55 * whiteNoteWidth;

/* ---- NOTES ----------------------------------------------------------------------*/

class Note {
  constructor(note, x, y) {
    this.note = note; // note will be a string of a single letter from A-G
    // needs position coordinates and width and height
    this.x = x;
    this.y = y;
    this.r = null;
    this.g = null;
    this.b = null;
    this.alpha = null;
  }
  show() {
    stroke("black");
    strokeWeight(1);
    fill(this.r, this.g, this.b, this.alpha);
    rect(this.x, this.y, this.w, this.h);
  }
}
class whiteNote extends Note {
  constructor(note, x, y) {
    super(note, x, y);
    this.w = whiteNoteWidth;
    this.h = whiteNoteHeight;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.alpha = 0;
  }
}
class blackNote extends Note {
  constructor(note, x, y) {
    super(note, x, y);
    this.note = this.note + "#";
    this.w = blackNoteWidth;
    this.h = blackNoteHeight;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.alpha = 255;
  }
}
class timeNote extends Note {
  // takes the width of the track section and number of bars
  // type will be 1, 2, 4, or 8 corresponding to whole, half, quarter, and eighth respectively
  constructor(note, x, y, tracks_width, bars, type, colours) {
    super(note, x, y);
    this.note = this.note + "4";
    this.beat = null;
    this.type = type;
    this.value = type.toString() + "n";
    this.h = blackNoteHeight * 0.75;
    this.tw = tracks_width;
    this.bars = bars;
    this.eighth = tracks_width / (bars * 8);
    this.w = this.eighth * (8 / type) * 0.95;
    this.r = colours[0];
    this.g = colours[1];
    this.b = colours[2];

    this.selected = false;
    this.hovered = false;
  }
  show() {
    stroke("black");
    strokeWeight(1);
    if (this.selected) {
      fill(this.r * (3 / 5), this.g * (3 / 5), this.b * (3 / 5));
    } else if (this.hovered) {
      fill(this.r * (4 / 5), this.g * (4 / 5), this.b * (4 / 5));
    } else {
      fill(this.r, this.g, this.b);
    }
    rect(this.x, this.y, this.w, this.h);
  }
  update() {
    if (this.selected) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }
  over() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.hovered = true;
    } else {
      this.hovered = false;
    }
  }
  clicked() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.selected = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }
  released() {
    this.selected = false;
  }
}
// templateNotes will be always at the bottom to be dragged on to tracks

class templateNote extends timeNote {
  constructor(note, x, y, tracks_width, bars, type, colours) {
    super(note, x, y, tracks_width, bars, type, colours);
    this.x0 = x;
    this.y0 = y;
  }
  released() {
    this.selected = false;
    this.x = this.x0;
    this.y = this.y0;
  }
}


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
