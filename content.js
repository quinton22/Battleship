// Variables to change how the game is played
const SHIP_SIZES = [5, 4, 3, 3, 2]; // size of each ship
const COLUMN_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
   "T", "U", "V", "W", "X", "Y", "Z"];

var boardsOnScreen = [];

class Ship {
   constructor(x, y, height, width, length, id) {
      this.x = x; // x position (px)
      this.y = y; // y position (px)
      this.height = height; // height (px)
      this.width = width; // width (px)
      this.length = length // length of ship (number of blocks)
      this.id = id;
      this.orientation = "v"; // v = vertical, h = horizontal
      this.spot = null; //Row and col of the ship, leftmost and uppermost
      this.hit = []; // array of hit / miss starting at uppermost or leftmost
      this.rememberX = x; // last x position
      this.rememberY = y; // last x position
      for (let i = 0; i < this.length; ++i) {
         this.hit.push(false);
      }
      this.drawing = null;
      this.dragging = false;
      this.focused = false;
      this.mousePosition = [];
   }

   changeOrientation() {
      let newHeight = this.width;
      this.width = this.height;
      this.height = newHeight;
      this.orientation = this.orientation === "v" ? "h" : "v";
      this.redraw();
   }

   redraw() {
      let ship = this.drawing;
      ship.style.top = (this.y).toString() + "px";
      ship.style.left = (this.x).toString() + "px";
      ship.style.height = (this.height).toString() + "px";
      ship.style.width = (this.width).toString() + "px";
   }

   // draws a ship which is a gray rectangle
   draw() {
      let ship = document.createElement("div");
      ship.style.top = (this.y).toString() + "px";
      ship.style.left = (this.x).toString() + "px";
      ship.style.height = (this.height).toString() + "px";
      ship.style.width = (this.width).toString() + "px";
      ship.className = "ship";
      ship.id = this.id;

      this.drawing = ship;

      let _this = this;
      this.drawing.addEventListener("dblclick", function shipDblClick() {
            _this.changeOrientation();
      });
      this.drawing.addEventListener("mousedown", function shipMouseDown(event) {
         _this.dragging = true;

      });
      this.drawing.addEventListener("mouseup", function shipMouseUp(event) {
         _this.mousePosition = [];
         _this.drawing.style.zIndex = "2";
         let table = _this.drawing.parentNode.querySelector("table");

         let tableLeftBound =  table.parentNode.previousSibling.offsetWidth + table.querySelector("td").offsetWidth/2;
         let tableRightBound = table.parentNode.parentNode.offsetWidth - _this.width + table.querySelector("td").offsetWidth/2;
         let tableTopBound =  table.querySelector("caption").offsetHeight + table.querySelector("tr").offsetHeight/2;
         let tableBottomBound = table.offsetHeight - _this.height + table.querySelector("tr").offsetHeight/2;

         if (_this.x > tableLeftBound && _this.y > tableTopBound && _this.x < tableRightBound && _this.y < tableBottomBound) {

            // find closest row and snap to it
            let trPos, tdPos;
            let shipPos = _this.drawing.getBoundingClientRect();
            let trArray = table.querySelectorAll("tr");
            let minDist = trArray[0].offsetHeight;
            let minDistSigned;
            let row = -1;
            let col = -1;
            trArray.forEach(function(tr, idx) {
               trPos = tr.getBoundingClientRect();
               if (Math.abs(trPos.top - shipPos.top) < minDist) {
                  minDistSigned = trPos.top - shipPos.top;
                  minDist = Math.abs(minDistSigned);
                  row = idx;
               }
            });

            if (_this.dragging) {
               _this.y += minDistSigned + trArray[row].offsetHeight * .05;
            }

            let tdArray = trArray[row].querySelectorAll("td");
            minDist = tdArray[0].offsetWidth;
            tdArray.forEach(function(td, idx) {
               tdPos = td.getBoundingClientRect();
               if (Math.abs(tdPos.left - shipPos.left) < minDist) {
                  minDistSigned = tdPos.left - shipPos.left;
                  minDist = Math.abs(minDistSigned);
                  col = idx;
               }
            });

            if (_this.dragging) {
               _this.x += minDistSigned + tdArray[col].offsetWidth * .06;
            }

            _this.spot = [row-1, col];

            _this.rememberX = _this.x;
            _this.rememberY = _this.y;
            _this.redraw();
         } else {
            console.log("Place ship on board");
            _this.x = _this.rememberX;
            _this.y = _this.rememberY;
            _this.redraw();
         }
         _this.dragging = false;
      });
      this.drawing.addEventListener("mouseover", function shipMouseOver(event) {
         _this.focused = true;

      });

      this.drawing.addEventListener("mousemove", function shipMouseMove(event) {
         if (_this.dragging && _this.focused) {
            _this.drawing.style.zIndex = "3";
            let rect = _this.drawing.getBoundingClientRect();
            // rect.left / rect.right vs event.clientX
            let xDist = event.clientX - rect.left; // distance from mouse to side of ship
            let yDist = event.clientY - rect.top; // distance from mouse to top of ship

            if (_this.mousePosition.length === 0) {
               _this.mousePosition = [xDist, yDist];
            } else if (_this.mousePosition.length !== 0) {
               _this.x += xDist - _this.mousePosition[0];
               _this.y += yDist - _this.mousePosition[1];
               _this.redraw();
            }

         }
      });

      document.addEventListener("keypress", function shipKeyPress(event) {
         if (_this.focused) {
            let key = event.keyCode ? event.keyCode : event.which;
            if ((key == 86 || key === 118) && _this.orientation === "h") { // V, v
               _this.changeOrientation();
            } else if ((key === 72 || key === 104) && _this.orientation === "v") { // H, h
                     _this.changeOrientation();
            } else if (key === 32) { // space
               _this.changeOrientation();
            }
         }

      });

      this.drawing.addEventListener("mouseout", function shipMouseOut(event) {
         _this.drawing.className = "ship";
         _this.focused = false;
         let mouseUp = new MouseEvent('mouseup');
         _this.drawing.dispatchEvent(mouseUp);
      });

      return ship;
   }

}

class Board {
   constructor(height, width, player) {
      this.height = height; // height (px)
      this.width = width; // width (px)
      this.player = player;
      this.size = 10; // Playable grid size
      this.drawing = null;

      this.shipPlaces = [];
      this.guesses = [];

      // Creates array of Ship objects
      this.ships = [];
      let _this = this; // allows this to work in foreach loop
      SHIP_SIZES.forEach(function(length, idx) {
         _this.ships.push(new Ship(0, _this.height/(_this.size + 1), length * _this.height/(_this.size + 1) - 6, _this.width/(_this.size + 1) - 6, length, "ship" + idx.toString()));
      });
      this.shipset = false;
   }

   saveShipPlace() {
      this.ships.forEach(function(ship) {
         // clone to remove event listeners
         let clone = ship.drawing.cloneNode();
         ship.drawing.parentNode.replaceChild(clone, ship.drawing);
         ship.drawing = clone;
         ship.drawing.className += " shipset";

         let shipPosition = [];
         shipPosition.push(ship.spot);
         if (ship.orientation === "v") {
            for(let i = 1; i < ship.length; ++i) {
               shipPosition.push([ship.spot[0] + i, ship.spot[1]]);
            }
         } else {
            for(let i = 1; i < ship.length; ++i) {
               shipPosition.push([ship.spot[0], ship.spot[1] + i]);
            }
         }
         console.log(shipPosition);
         this.shipPlaces.push(shipPosition);
      });
   }

   hideShips() {
      this.ships.forEach(function(ship) {
         ship.drawing.style.display = "none";
      });
   }

   redraw() {
      let trArray = this.drawing.querySelectorAll("tr");
      let _this = this;
      this.drawing.querySelector("table").setAttribute("height", this.height.toString() + "px");
      this.drawing.querySelector("table").setAttribute("width", this.width.toString() + "px");
      trArray.forEach(function(tr) {
         tr.setAttribute("height", (_this.height / (_this.size + 1)).toString() + "px"); // check
         tr.style.width = (_this.width).toString() + "px";
      });
      this.ships.forEach(function(s) {
         s.redraw();
      });
   }

   deleteDraw() {
      this.drawing ? this.drawing.parentNode.removeChild(this.drawing) : null;
   }

   draw() {
      // Create the board and board container
      let tDivContainer = document.createElement("div"); // outer container
      tDivContainer.className = "table-div-container";

      let shipContainer = document.createElement("aside");
      shipContainer.id = "ship-container";
      shipContainer.innerHTML = "<strong>Ships:</strong>";
      tDivContainer.appendChild(shipContainer);


      let tableDiv = document.createElement("div"); // table container
      tableDiv.id = this.player;
      let table = document.createElement("table"); // table
      tableDiv.appendChild(table);

      let caption = document.createElement("caption"); // caption "Player __"
      caption.innerHTML = this.player + "'s Board";
      table.appendChild(caption);
      tDivContainer.appendChild(tableDiv);

      // puts in cells
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

               // adds id to each cell in the form [col]_[row]
               td.id = (r - 1).toString() + "_" +(q - 1).toString();
            }
            td.setAttribute("width", this.width / (this.size + 1)); // check
            tr.appendChild(td);
            tr.setAttribute("height", this.height / (this.size + 1)); // check
         }
         tr.style.width = (this.width).toString() + "px";
         table.appendChild(tr);
      }
      table.setAttribute("height", this.height.toString() + "px");
      table.setAttribute("width", this.width.toString() + "px");

      tableDiv.appendChild(table);
      tableDiv.className = "table-div";

      this.ships.forEach(function (ship) {
         tableDiv.appendChild(ship.draw());
      });
      document.getElementById("board-cell").appendChild(tDivContainer);
      this.drawing = tableDiv;
   }
}

// handles resizing of window
window.addEventListener("resize", function () {
   // set board height and width on resize
   let previousHeight;
   let boardHeight = setBoardHeight();
   boardsOnScreen.forEach(function(b) {
      previousHeight = b.height;
      b.height = boardHeight;
      b.width = boardHeight;
      b.ships.forEach(function(s) {
         if (s.orientation === "v") {
            s.height = s.length * (boardHeight / (b.size + 1)) - 6;
            s.width = boardHeight / (b.size + 1) - 6;

            if (s.spot) {
               let table = s.drawing.parentNode.querySelector("table");
               let bRectTd = table.querySelectorAll("td")[s.spot[0] * b.size + s.spot[1]].getBoundingClientRect();
               let bRectDiv = table.parentNode.parentNode.getBoundingClientRect();
               s.y = bRectTd.top - bRectDiv.top + table.querySelector("td").offsetHeight * .06;
               s.x = bRectTd.left - bRectDiv.left + table.querySelector("td").offsetWidth * .06;
            } else {
               s.x = s.x * b.height / previousHeight;
               s.y = s.y * b.height / previousHeight;
            }

         } else {
            s.width = s.length * (boardHeight / (b.size + 1)) - 6;
            s.height = boardHeight / (b.size + 1) - 6;
         }
      });
      b.redraw();
   });
});

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
      hideTitle(3);
   });

   document.getElementById("back-btn").addEventListener("click", function() {
      let titleDiv = document.getElementById("title-div");

      if (document.getElementById("instr-container").style.display === "block") {
         document.getElementById("instr-header").style.display = "none";
         document.getElementById("instr-container").style.display = "none";
         titleDiv.style.display = "block";
      } else if (document.getElementById("one-player-mode").style.display === "block") {
         document.getElementById("one-player-mode").style.display = "none";
         titleDiv.style.display = "block";
         boardsOnScreen.forEach(function (b) {
            b.deleteDraw();
         });
         document.getElementById("board-container").style.display = "none";
      } else if (document.getElementById("two-player-mode").style.display === "block") {
         document.getElementById("two-player-mode").style.display = "none";
         titleDiv.style.display = "block";
         boardsOnScreen = [];
         document.getElementsByClassName("table-div-container")[0].parentNode.removeChild(document.getElementsByClassName("table-div-container")[0]);
         document.getElementById("board-container").style.display = "none";
      }
   });
};

// Hides the titleDiv and calls mode function to initiate game
function hideTitle(mode) {
   document.getElementById("title-div").style.display = "none";
   document.getElementById("board-container").style.display = "block"; // shows board container

   if (mode === 1) {
      initOnePlayer();
   } else if (mode === 2) {
      initTwoPlayer();
   } else {
      goToInstr();
   }
}

// Starts the one player mode
function initOnePlayer() {
   document.getElementById("one-player-mode").style.display = "block";
}

// Starts the two player mode
function initTwoPlayer() {
   let boardHeight = setBoardHeight(); // Sets board height and width depending on the page size

   // creates boards
   let board1 = new Board(boardHeight, boardHeight, "Player One");
   boardsOnScreen.push(board1);
   let board2 = new Board(boardHeight, boardHeight, "Player Two");
   boardsOnScreen.push(board2);

   document.getElementById("two-player-mode").style.display = "block";


   let instrP = document.createElement("p");
   instrP.innerHTML = "Place ships on the board by dragging them. Change their orientation by double clicking or pressing space, h, or v while hovered over them. Click \"Done\" when finished.";
   document.getElementById("instructions-aside").appendChild(instrP);
   instrP.setAttribute("margin-top", "10%");

   board1.draw();
   board2.draw();

   // SET TIMEOUT FOR ASIDE TO DISPLAY
   let doneBtn = document.getElementById("done-btn");
   let doneBtnClick;
   doneBtn.addEventListener("click", doneBtnClick = function () {
      if (board1.drawing.style.display = "block") {
         board1.saveShipPlaces();
         board1.drawing.style.display = "none";
         board1.drawing.querySelector("aside").style.display = "none";
         board2.drawing.style.display = "block";
      } else { // board 2 handler
         board2.saveShipPlaces();
         board1.drawing.style.display = "none";
         board1.drawing.querySelector("aside").style.display = "none";
      }
   });

   doneBtn.removeEventListener("click", doneBtnClick);

   document.getElementById
   let commentary = document.createElement("p");
   let randInt = Math.floor(Math.random() * 2);
   let startingPlayer = "Player One";
   if (randInt === 1) {
      startingPlayer = "Player Two";
   }
   commentary.innerHTML = startingPlayer + " has been picked to go first. Click \"Start\" to begin";
   doneBtn.innerHTML = "Start";
   doneBtn.parentNode.insertBefore(commentary);




}

function goToInstr() {
   document.getElementById("instr-container").style.display = "block";
   document.getElementById("instr-header").style.display = "block";
}

function setBoardHeight() {
   let boardContainer = document.getElementById("board-container");
   let maxSize = (window.innerHeight - document.querySelector("header").offsetHeight) * .6;
   let minSize = 190;
   let height = boardContainer.offsetWidth/3;
   if (height > maxSize) {
      return maxSize;
   } else if (height < minSize) {
      return minSize;
   } else {
      return height;
   }
}
