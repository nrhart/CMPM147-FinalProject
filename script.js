var canvas = document.getElementById("game");
var canvasContext = canvas.getContext("2d");

var w = 20;

var rows = 50;
var cols = 50;

var grid = [];

var rooms = [];
var collide = false;

var amount = 10;
var size = 5; //the actual size will be a number between 5 and 10 | e.g: size+sizeMin
var sizeMin = 5;

var disX;
var disY;
var corridorW = 1;

function Cell(c, r, x, y) {
  this.c = c;
  this.r = r;
  this.x = x;
  this.y = y;
  this.empty = false;
  
  this.show = function() {
    if (this.empty == false) {
      canvasContext.fillStyle = "#323232";
      canvasContext.fillRect(this.x, this.y, w, w);
    } else {
      canvasContext.fillStyle = "#696966";
      canvasContext.fillRect(this.x, this.y, w, w);
    }
  };

  this.carve = function(dis, x, y) {
    for (var i = 0; i < rooms.length; i++) {
      if (
        this.c >= rooms[i].y / w &&
        this.c < rooms[i].y / w + rooms[i].h / w &&
        this.r >= rooms[i].x / w &&
        this.r < rooms[i].x / w + rooms[i].w / w
      ) {
        this.empty = true;
      }
    }
  };

  this.carveH = function(dis, x, y) {
    if (
      this.r >= x &&
      this.r < x + dis &&
      this.c < y + corridorW &&
      this.c > y - corridorW
    ) {
      this.empty = true;
    }
  };
  this.carveV = function(dis, x, y) {
    if (
      this.c >= y &&
      this.c < y + dis &&
      this.r < x + corridorW &&
      this.r > x - corridorW
    ) {
      this.empty = true;
    }
  };
}

function makeGrid() {
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var y = c * w;
      var x = r * w;
      var cell = new Cell(c, r, x, y);
      grid.push(cell);
    }
  }
}

function draw() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
    grid[i].carve();
  }

  for (var i = 0; i < rooms.length; i++) {
    rooms[i].draw();
  }
}

makeGrid();
//createRooms();
draw();