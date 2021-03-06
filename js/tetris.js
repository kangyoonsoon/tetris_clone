import BLOCKS from "./blocks.js";

// DOM
const game = document.querySelector(".game > ul");
const gameText = document.querySelector(".game-text");
const startButton = document.querySelector(".game-text > button");
const scoreDisplay = document.querySelector(".score-text >.score");
const scoreEnd = document.querySelector(".game-text >.score");

// variables
const GAME_ROWS = 20;
const GAME_COLS = 10;
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem = {
  type: "",
  direction: 3,
  top: 0,
  left: 3,
};

init();

// functions
function init() {
  tempMovingItem = { ...movingItem };

  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
  }

  // renderBlocks();
  generateNewBlock();
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");

  for (let j = 0; j < GAME_COLS; j++) {
    const horizon = document.createElement("li");
    ul.prepend(horizon);
  }

  li.prepend(ul);
  game.prepend(li);
}

function renderBlocks(moveType = "") {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  // console.log(movingBlocks);
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });
  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    const target = game.childNodes[y]
      ? game.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);
    if (isAvailable) {
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem };
      if (moveType === "end") {
        clearInterval(downInterval);
        showGameOver();
      }
      setTimeout(() => {
        renderBlocks("end");
        if (moveType === "top") {
          seizeBlock();
        }
      }, 5);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}

function checkMatch() {
  const childNodes = game.childNodes;
  // console.log(childNodes);
  childNodes.forEach((child) => {
    let matched = true;
    child.childNodes[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });
    if (matched) {
      child.remove();
      prependNewLine();
      score++;
      scoreDisplay.innerText = score;
      scoreEnd.innerText = score;
    }
  });

  generateNewBlock();
}
function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);
  const blockArray = Object.entries(BLOCKS);
  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

function changeDirection() {
  tempMovingItem.direction += 1;
  if (tempMovingItem.direction === 4) {
    tempMovingItem.direction = 0;
  }
  renderBlocks();
}

function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

function showGameOver() {
  gameText.style.display = "flex";
}

// event handling
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
    default:
      break;
  }
  // console.log(e);
});
startButton.addEventListener("click", () => {
  game.innerHTML = "";
  gameText.style.display = "none";
  init();
});
