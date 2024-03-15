var whiteNoteHeight = 60;
var blackNoteHeight = whiteNoteHeight / 2;
var whiteNoteWidth = 100;
var blackNoteWidth = 0.55 * whiteNoteWidth;

/* ------ TRACKS -----------------------------------------------------------------------*/

class Track {
    // takes the width of the whole keyboard
    // key is of class Note
    constructor(width, key) {
      this.w = width - whiteWidth - 4;
      this.note = key.note + "4";
      this.x = key.x + whiteWidth;
      this.r = null;
      this.g = null;
      this.b = null;
      this.alpha = null;
    }
    show() {
      stroke(200, 200, 200, 100);
      strokeWeight(1);
      fill(this.r, this.g, this.b, this.alpha);
      rect(this.x, this.y, this.w, this.h);
    }
  }
  class wideTrack extends Track {
    constructor(y, width, key) {
      super(width, key);
      this.y = y;
      this.h = 0.75 * key.h;
      this.r = 255;
      this.g = 255;
      this.b = 255;
      this.alpha = 100;
    }
  }
  class whiteTrack extends Track {
    constructor(width, key) {
      super(width, key);
      // when only using white tracks
      this.h = key.h;
      this.y = key.y;
      //this.h = key.h / 2;
      //this.y = key.y + 0.25 * key.h;
      this.r = 255;
      this.g = 255;
      this.b = 255;
      this.alpha = 100;
    }
  }
  class blackTrack extends Track {
    constructor(width, key) {
      super(width, key);
      this.y = key.y;
      this.h = key.h;
      this.r = 200;
      this.g = 200;
      this.b = 200;
      this.alpha = 100;
      fill(200, 200, 200, 100);
      rect(this.x, this.y, this.w, this.h);
    }
  }