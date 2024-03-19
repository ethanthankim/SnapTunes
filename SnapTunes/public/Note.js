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
