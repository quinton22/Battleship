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
      for (let i = 0; i < this.length; ++i) {
         this.hit.push(false);
      }
      this.drawing = null;
      this.dragging = false;
      this.focused = false;
      this.mousePosition = [];
   }

   changeOrientation() {
      console.log("dblclick");
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
         _this.dragging = false;
         _this.mousePosition = [];
         _this.drawing.style.zIndex = "2";
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

      // Creates array of Ship objects
      this.ships = [];
      let _this = this; // allows this to work in foreach loop
      SHIP_SIZES.forEach(function(length, idx) {
         _this.ships.push(new Ship(0, _this.height/(_this.size + 1), length * _this.height/(_this.size + 1) - 4, _this.width/(_this.size + 1) - 4, length, "ship" + idx.toString()));
      });
      this.shipset = false;
   }

   saveShipPlace() {
      this.ships.forEach(function(ship) {
         ship.drawing.className += " shipset";
         ship.drawing.removeEventListener("dblclick", shipDblClick);
         ship.drawing.removeEventListener("mousedown", shipMouseDown);
         ship.drawing.removeEventListener("mouseup", shipMouseUp);
         ship.drawing.removeEventListener("mouseover", shipMouseOver);
         ship.drawing.removeEventListener("mouseout", shipMouseOut);
      });
      return;
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
      if (this.shipset) {
         saveShipPlace();
      }
      this.drawing ? this.drawing.parentNode.removeChild(this.drawing) : null;
   }

   draw() {
      // Create the board and board container
      let tDivContainer = document.createElement("div"); // outer container
      tDivContainer.className = "table-div-container";

      let shipContainer = document.createElement("aside");
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
               td.id = COLUMN_LETTERS[(r - 1) % this.size] + Math.floor((r - 1) / this.size).toString() + "_" + q.toString();
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
   let boardHeight = setBoardHeight();
   console.log("boardheight", boardHeight);
   boardsOnScreen.forEach(function(b) {
      b.height = boardHeight;
      b.width = boardHeight;
      b.ships.forEach(function(s) {
         if (s.orientation === "v") {
            s.height = s.length * (boardHeight / (b.size + 1)) - 4;
            s.width = boardHeight / (b.size + 1) - 4;
         } else {
            s.width = s.length * (boardHeight / (b.size + 1)) - 4;
            s.height = boardHeight / (b.size + 1) - 4;
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
   });
};

// Hides the titleDiv and calls mode function to initiate game
function hideTitle(mode) {
   document.getElementById("titleDiv").style.display = "none";
   document.getElementById("board-container").style.display = "block"; // shows board container

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
   let boardHeight = setBoardHeight(); // Sets board height and width depending on the page size

   // creates board
   let board1 = new Board(boardHeight, boardHeight, "Player One");
   boardsOnScreen.push(board1);

   document.getElementById("two-player-mode").style.display = "block";

   board1.draw();

   board1.drawing.addEventListener("dragover", function (event) {
      event.preventDefault();
   });
   board1.drawing.addEventListener("drop", function (event) {
      event.preventDefault();
   });

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
// //start with only the mousedown event attached
// canvas.addEventListener("mousedown",mousedown);
//
// //and some vars to track the dragged item
// var dragIdx = -1;
// var dragOffsetX, dragOffsetY;
//
// function mousedown(e){
//     //...calc coords into mouseX, mouseY
//     for(i=circArray.length; i>=0; i--){ //loop in reverse draw order
//         dx = mouseX - circArray[i].x;
//         dy = mouseY - circArray[i].y;
//         if (Math.sqrt((dx*dx) + (dy*dy)) < circArray[i].r) {
//             //we've hit an item
//             dragIdx = i; //store the item being dragged
//             dragOffsetX = dx; //store offsets so item doesn't 'jump'
//             dragOffsetY = dy;
//             canvas.addEventListener("mousemove",mousemove); //start dragging
//             canvas.addEventListener("mouseup",mouseup);
//             return;
//         }
//     }
// }
//
// function mousemove(e) {
//      //...calc coords
//      circArray[dragIdx].x = mouseX + dragOffsetX; //drag your item
//      circArray[dragIdx].y = mouseY + dragOffsetY;
//      //...repaint();
// }
//
// function mouseup(e) {
//      dragIdx = -1; //reset for next mousedown
//     canvas.removeEventListener(.... //remove the move/up events when done
