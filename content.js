// Variables to change how the game is played
const SHIP_SIZES = [5, 4, 3, 3, 2]; // size of each ship
const COLUMN_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
   "T", "U", "V", "W", "X", "Y", "Z"];

var startingPositions = {
   carrier: [0, 0],
   battleship: [0, 0],
   cruiser: [0, 0],
   submarine: [0, 0],
   destroyer: [0, 0]
}

class Ship {
   constructor(x, y, height, width, length) {
      this.x = x; // x position (px)
      this.y = y; // y position (px)
      this.height = height; // height (px)
      this.width = width; // width (px)
      this.length = length // length of ship (number of blocks)
      this.orientation = "v"; // v = vertical, h = horizontal
      this.hit = false; // hit or miss
   }

   // draws a ship which is a gray rectangle
   draw() {
      let ship = document.createElement("div");
      ship.style.top = this.y.toString() + "px";
      ship.style.left = this.x.toString() + "px";
      ship.setAttribute("height", this.height);
      ship.setAttribute("width", this.width);
      ship.className = "ship";

      return ship;
   }
}

class Board {
   constructor(x, y, height, width) {
      this.x = x; // x position (px)
      this.y = y; // y position (px)
      this.height = height; // height (px)
      this.width = width; // width (px)
      this.size = 10; // Playable grid size

      // Creates array of Ship objects
      this.ships = [];
      let _this = this; // allows this to work in foreach loop
      SHIP_SIZES.forEach(function(length) {
         _this.ships.push(new Ship(_this.x-100, _this.y, length * _this.height/(_this.size + 1), _this.width/(_this.size + 1), length));
      });
   }

   draw() {
      // Create the board
      let tableDiv = document.createElement("div");
      let table = document.createElement("table");
      tableDiv.appendChild(table);
      for(let q = 0; q <= this.size; ++q) {
         let tr = document.createElement("tr");
         let td;
         for(let r = 0; r <= this.size; ++r) {
            if (q === 0 || r === 0) {
               td = document.createElement("th");
               if (q === 0 && r !== 0) {

                  // Puts column letters at top of table, if longer than 26 then uses A1, B1, ... etc
                  if (q < COLUMN_LETTERS.length) {
                     td.innerHTML = COLUMN_LETTERS[r - 1];
                  } else {
                     td.innerHTML = COLUMN_LETTERS[(r - 1) % this.size] + Math.floor((r - 1) / this.size).toString();
                  }
               // Puts numbers on side of rows
               } else if (r === 0 && q !== 0) {
                  td.innerHTML = q.toString();
               }
            } else {
               td = document.createElement("td");
               td.ID = COLUMN_LETTERS[(r - 1) % this.size] + Math.floor((r - 1) / this.size).toString() + "_" + q.toString();
            }
            td.setAttribute("width", this.width / (this.size + 1));
            tr.appendChild(td);
            tr.setAttribute("height", this.height / (this.size + 1));
         }
         tr.style.width = this.width;
         table.appendChild(tr);
      }
      table.setAttribute("height", this.height);
      table.setAttribute("width", this.width);
      tableDiv.appendChild(table);
      tableDiv.className = "table-div";
      tableDiv.style.top = this.y.toString() + "px";
      tableDiv.style.left = this.x.toString() + "px";
      console.log();

      // Create the grid lines on the board
      let blockSize = [this.width/(this.size + 1), this.height/(this.size + 1)]; // width of one block and height of one block

      this.ships.forEach(function (ship) {
         //tableDiv.appendChild(ship.draw());
      });
      document.getElementById("board-container").appendChild(tableDiv);
   }


}

window.onload = function() {

   // click event to one player button
   document.getElementById("one-player-btn").addEventListener("click", function () {
      console.log("Init 1 player mode");
      hideTitle(1);
   });

   // click event to two player button
   document.getElementById("two-player-btn").addEventListener("click", function() {
      console.log("Init 2 player mode");
      hideTitle(2);
   });

   // click event on instructions button
   document.getElementById("instructions-btn").addEventListener("click", function() {
      console.log("Instructions Page")
   });
};

// Hides the titleDiv and calls mode function to initiate game
function hideTitle(mode) {
   document.getElementById("titleDiv").style.display = "none";
   document.getElementById("board-container").style.display = "block";
   if (mode === 1) {
      initOnePlayer();
   } else {
      initTwoPlayer();
   }
}

// Starts the one player mode
function initOnePlayer() {
   document.getElementById("one-player-mode").style.display = "block";
}

// Starts the two player mode
function initTwoPlayer() {
   let boardHeight = document.getElementById("board-container").offsetWidth;

   // Sets board height and width depending on the page size;

   // creates board
   let board1 = new Board(window.innerWidth/4, boardHeight/2, boardHeight, boardHeight);


   document.getElementById("two-player-mode").style.display = "block";
   console.log(document.getElementById("board-container").offsetWidth);
   setTimeout(function () {
      board1.draw(); // draws board
   }, 100);

}
