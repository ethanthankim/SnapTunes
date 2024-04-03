var whiteNoteHeight = 60;
var blackNoteHeight = whiteNoteHeight / 2;
var whiteNoteWidth = 100;
var blackNoteWidth = 0.55 * whiteNoteWidth;

/* ---- Note.js ----------------------------------------------------------------------*/

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
    this.className = "empty";
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
    this.className = "empty";
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
    this.className = "empty";
  }
}
class timeNote extends Note {
  // takes the width of the track section and number of bars
  // type will be 1, 2, 4, or 8 corresponding to whole, half, quarter, and eighth respectively
  constructor(note, x, y, tracks_width, bars, type, colours) {
    if (arguments.length == 4){
      super(note, 0, 0);
      this.simpleConstructor(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    else {
      super(note, x, y);
      this.note = this.note;
      this.bar = 0;
      this.beat = 0;
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
  }
  simpleConstructor(note, type, bar, beat) {
    this.note = note;
    this.type = type;
    this.bar = bar;
    this.beat = beat;
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
<<<<<<< Updated upstream
=======
    this.className = "nanimate";
  /*
    this.animate(
      [
        {transform: scale(1)},
        {transform: scale(1.25)},
        {transform: scale(0.75)},
        {transform: scale(1)},
      ],
    {
      duration:600,
    },
  );*/

>>>>>>> Stashed changes
  }
  getBeat() {
    return this.bar.toString() + ":" + this.beat.toString();
  }
  getType() {
    return this.type.toString() + "n";
  }
  inTrack(track) {
    // returns true if note is within the track
    return (
      this.x >= track.x &&
      this.x + this.w <= track.x + track.w &&
      this.y >= track.y &&
      this.y + this.h <= track.y + track.h
    );
  }
  setNote(tracks) {
    for (var track of tracks) {
      if (this.inTrack(track)) {
        this.note = track.note;
        return;
      }
    }
    this.note = null;
  }
  setBeat(tracks) {
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
        this.x >= tracks[0].x + i * increment &&
        this.x <= tracks[0].x + (i + 1) * increment
      ) {
        this.bar = bar;
        this.beat = beat;
        break;
      }
      beat = beat + 0.5;
    }
  }
  equals(other){
    return (
      this.note == other.note &&
      this.bar == other.bar &&
      this.beat == other.beat &&
      this.type == other.type);
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

class Melody {
  constructor(notes) {
    // notes is array of class note
    // length is number of sections. added by 1 each time a horizontal snap takes place
    this.notes = notes;
    this.score = [];
    this.length = 1;
    this.numSections = 1;
    this.setScore();
  }
  setScore() {
    this.score = [];
    for (var note of this.notes) {
      if (note.note == null) {
        this.removeNote(note);
        continue;
      }
      this.score.push({ time: note.getBeat(), note: note.note, type: note.getType() });
    }
  }
  addNote(note) {
    this.notes.push(note);
    this.score.push({time:note.getBeat(), note: note.note, type: note.getType() });
  }
  removeNote(note) {
    for (var i = 0; i < this.notes.length; i++) {
      var currNote = this.notes[i];
      if (currNote.equals(note)) {
        return this.notes.splice(i,1);
      }
    }
    return null;
  }
  addMelody(other) {
    for (var note of other.notes) {
      this.addNote(note);
    }
  }
  removeMelody(other) {
    for (var note of other.notes) {
      this.removeNote(note);
    }
    this.setScore();
    return this;
  }
}