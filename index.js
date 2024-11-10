
const main = document.querySelector(".main");
const myBox = main.querySelector(".myBox");
const BombCount = main.querySelector("span");
const flagLeft = main.querySelector("#flagCount");
const width = 10;
let bombAmount = 2;
let newArray = [];
let bombArray = [];
let isGameOver = false;
let flagsRemaining = bombAmount;

/**
 * This is the initialization part of the game.
 * newArray is created 
 * bombArray is created
 * and they are called from here.
 */
function initializeGame() {
  newArray = new Array(100).fill(" ");
  flagsRemaining = bombAmount;
  bombArray = [];
  isGameOver = false;
  BombCount.innerHTML = bombAmount;
  generateBombs(bombAmount, newArray);
  createBoard();
  flagLeft.textContent = bombAmount;
}

// Function to get a random integer
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Generates a specified number of bombs and places them in the array.
 * The function randomly selects indices in the array to place bombs, ensuring that
 * no bomb is placed in a place that already contains a bomb.
 * @param {*} noOfBombs Total number of bombs to be placed
 * @param {*} newArray Array that contains bombs and empty spaces
 */
function generateBombs(noOfBombs, newArray) {
  let bombPlaced = 0;
  while (bombPlaced < noOfBombs) {
    const rndIndex = getRndInteger(0, newArray.length);
    if (newArray[rndIndex] === " ") {
      newArray[rndIndex] = "Bomb";
      bombArray.push(rndIndex);
      bombPlaced++;
    }
  }
  console.log(bombArray);
}

/**
 * Counts the number of bombs adjacent to a given cell on the board.
 * This function checks the eight possible surrounding positions of a cell
 * and returns the total count of bombs found.
 * @returns {number} The total count of adjacent bombs found.
 */
function countAdjacent(index) {
  const directionCheck = [(-width - 1), -width, (-width + 1) ,-1 , +1,(+width - 1), +width, (+width + 1)];
  let totalCount = 0;
  for (let i = 0; i < directionCheck.length; i++) {
      const newIndex = index + directionCheck[i];
      if (newIndex < 0 || newIndex >= newArray.length) {
          continue;
      }
      if((index % width ===0) && (directionCheck[i] === -1 || directionCheck[i] === -width - 1 || directionCheck[i] === +width - 1)){
          continue
      }
      if( (newIndex + 1) % width === 0 && (directionCheck[i] === +1 || directionCheck[i] === +width - 1 || directionCheck[i] === +width + 1)){
          continue
      }
      if (newArray[newIndex] === "Bomb") {
          totalCount++;
      }
  }
  return totalCount;
}

/**
 * Reveals all bomb locations on the board by displaying a bomb GIF in each corresponding cell.
 * @returns {void} This function does not return a value.
 */
function revealAllBombs() {
  const smallDivs = myBox.querySelectorAll("div");
  for (let index = 0; index < smallDivs.length; index++) {
    const div = smallDivs[index];
    if (newArray[index] === "Bomb") {
      const bombImage = document.createElement("img");
      bombImage.src = "bomb.gif";
      bombImage.style.width = "100%";
      bombImage.style.height = "100%";
      div.appendChild(bombImage);
      div.style.backgroundColor = "red";
    }
  }
  isGameOver = true;
}

/**
 * Reveals the initial cell and recursively reveals adjacent empty cells.
 * @param {number} index - The index of the cell that was clicked.
 */
function initialReveal(index) {
  const smallDivs = myBox.querySelectorAll("div");

  if (newArray[index] === "Bomb" || smallDivs[index].textContent !== "") return; 

  const adjacentCount = countAdjacent(index);
  smallDivs[index].textContent = adjacentCount > 0 ? adjacentCount : "";
  smallDivs[index].style.backgroundColor = adjacentCount > 0 ? "white" : "green";
  // smallDivs[index].classList.add('revealed');

  if (adjacentCount === 0) {
    const directionCheck = [(-width - 1), -width, (-width + 1), -1, +1, (+width - 1), +width, (+width + 1)];
    
    for (let i = 0; i < directionCheck.length; i++) {
      const newIndex = index + directionCheck[i];

      if (newIndex >= 0 && newIndex < newArray.length) {
        // if (smallDivs[newIndex].classList.contains('revealed')) {
        //   continue
        // }
        if(((index % width ===0) && (directionCheck[i] === -1 || directionCheck[i] === -width - 1 || directionCheck[i] === +width - 1))){
          continue
        }
        if( (newIndex + 1) % width === 0 && (directionCheck[i] === +1 || directionCheck[i] === +width - 1 || directionCheck[i] === +width + 1)){
          continue
        }
        initialReveal(newIndex);
      }
    }
  }
}

/**
 * Creates a 10x10 board of small div elements.
 * Each div represents a cell on the board.
 * @returns {void} This function does not return a value.
 */
function createBoard() {
  myBox.innerHTML = "";
  for (let i = 0; i < width * width; i++) {
    const newDiv = document.createElement("div");
    newDiv.id = i;
    newDiv.classList = "allCells";
    newDiv.addEventListener("click", () => {
      if (isGameOver) return;
      if (newDiv.textContent === "🚩") return;

      if (newArray[i] === "Bomb") {
        revealAllBombs();
        setTimeout(() => {
          gameEnd();
        }, 3000);
      } else {
        initialReveal(i); // Call to initialReveal
      }
      
      gameWon();
    });
    newDiv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (isGameOver) return;
      
      if (flagsRemaining > 0 && newDiv.textContent === "") {
        newDiv.textContent = "🚩"; 
        flagsRemaining--;
        updateFlagCount();
        setTimeout(()=>{
          gameWon()
        },2000)
        
      } else if (newDiv.textContent === "🚩") {
        newDiv.textContent = ""; // Remove the flag if already placed
        flagsRemaining++;
        updateFlagCount(); 
      }
    });
    myBox.appendChild(newDiv);
  }

  // for (let i = 0; i < newArray.length; i++) {
  //   const adjacentCount = countAdjacent(i);
  //   if (newArray[i] === "Bomb") {
  //     console.log(`Cell ${i}: Bomb, Adjacent Bombs Count = ${adjacentCount}`);
  //   } else {
  //     console.log(`Cell ${i}: Empty, Adjacent Bombs Count = ${adjacentCount}`);
  //   }
  // }
}

/**
 * Updating FlagsRemaining
 */
function updateFlagCount() {
  flagLeft.textContent = flagsRemaining;
}

/**
 * Image and a button is created to restart the game after some delay.
 */
function gameEnd() {
  const endDisplay = document.createElement("div");

  const nextime=document.createElement("p");
  nextime.textContent=" Better luck next time ! "
  endDisplay.appendChild(nextime)

  const endImg = document.createElement("img");
  endImg.src = "lastimg.png";
  endImg.id = "end-img";
  endDisplay.appendChild(endImg);

  const button = document.createElement("button");
  button.type = "button";
  button.innerText = "Try Again!";
  button.id = "btn-id";
  button.addEventListener("click", () => {
    initializeGame();
    endDisplay.remove();
  }, 3000);
  endDisplay.className = "after-game-end";
  endDisplay.appendChild(button);

  main.appendChild(endDisplay);
}



function gameWon() {
  let numFlags = 0; // Count of flags placed
  const smallDivs = myBox.querySelectorAll("div");

  // Count the number of flags placed
  for (let i = 0; i < smallDivs.length; i++) {
    if (smallDivs[i].textContent === "🚩") {
      numFlags++;
    }
  }

  // Check if the number of flags matches the number of bombs
  if (numFlags === bombArray.length) {
    const allFlagsCorrect = bombArray.every(index => {
      return smallDivs[index].textContent === "🚩";
    });

    // If all flags are correct, declare victory
    if (allFlagsCorrect) {
      isGameOver = true; // Mark the game as over
      revealAllBombs();
      displayWinMessage();
    }
  }
}

// Function to display a win message
function displayWinMessage() {
  const message = document.createElement("div");
  message.className = "win-message";
  message.textContent = " You won! 🏆";
  main.appendChild(message);
  const button = document.createElement("button");
  button.type = "button";
  button.innerText = "Restart";
  button.id = "btn-id2";
  button.addEventListener("click", () => {
    initializeGame();
    message.remove();
  }, 3000);
  message.appendChild(button);

  main.appendChild(message);
}


// Start the game
initializeGame();







