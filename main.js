const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const upImg = document.getElementById("bird0");
const fallImg = document.getElementById("bird1");
let bird = upImg;
let upTime = 30;
let fallTime = 0;
let birdX = 260;
let birdY = 200;
let score = 0;
let interval;

const wholeHeight = 150;
const pipesInterval = 250;
const pipesCount = 5;
const pipeWidth = 50;
let pipesSpeed = 2;

let pipesX = canvas.width;
let pipes = [];

const cloudImg = document.getElementById("cloud");
const cloudColumnCount = 3;
const cloudRowCount = 2;
const cloudInterval = 520;
const cloudWidth = 180;
let cloudPass = 0;
let clouds = [];

const homeImg = [];
const homeCount = 4;
let homePass = 0;
let homes = [];

for (let i = 0; i < pipesCount; i++) {
  pipes[i] = {
    x: 0,
    h: getRandomHeight(),
    c: getRandomColor(),
  };
}
for (let i = 0; i < cloudRowCount; i++) {
  clouds[i] = [];
  for (let j = 0; j < cloudColumnCount; j++) {
    clouds[i][j] = {
      x: 0,
      y: 0,
    };
  }
}
for (let i = 0; i < homeCount; i++) {
  homeImg[i] = document.getElementById(`home${i}`);
  homes[i] = {
    x: 0,
    y: canvas.height - (230 + 29 * (i % 2)),
    w: 325 + 140 * (i % 2),
  };
}

init();

document.addEventListener("click", () => {
  bird = upImg;
  upTime = 30;
  fallTime = 0;
});

function init() {
  draw();
  drawClick();
  highScoreText.innerHTML = `Highscore: ${localStorage.getItem("highScore")}`;
  document.addEventListener(
    "click",
    () => {
      interval = setInterval(draw, 10);
    },
    { once: true }
  );
}

function drawClick() {
  ctx.font = "bold 56px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ecfc03";
  ctx.fillText(`CLICK to START`, canvas.width / 2, canvas.height / 2);
}

function getRandomHeight() {
  return (
    Math.trunc(Math.random() * (canvas.height - wholeHeight - 20)) +
    wholeHeight +
    10
  );
}

// function getRandomColor() {
//   var letters = "0123456789ABCDEF";
//   var color = "#";
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

function getRandomColor() {
  let color = Math.floor(Math.random() * 16777215).toString(16);
  for (let i = 0; i < 6 - color.length; i++) {
    color = "0" + color;
  }
  return "#" + color;
}

function drawPipes() {
  for (let i = 0; i < pipesCount; i++) {
    pipes[i].x = pipesX + i * pipesInterval;
    ctx.beginPath();
    ctx.rect(pipes[i].x, 0, pipeWidth, pipes[i].h - wholeHeight);
    ctx.rect(pipes[i].x, pipes[i].h, pipeWidth, canvas.height - pipes[i].h);
    ctx.fillStyle = pipes[i].c;
    ctx.fill();
    ctx.closePath();
  }
}

function movePipes() {
  if (pipesX <= -pipeWidth) {
    pipesX = 200;
    pipes.shift();
    pipes.push({
      x: 0,
      h: getRandomHeight(),
      c: getRandomColor(),
    });
  }
  pipesX -= pipesSpeed;
}

function drawBird() {
  ctx.beginPath();
  ctx.drawImage(bird, birdX - 40, birdY - 20);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function moveBird() {
  if (upTime) {
    if (upTime === 15) bird = fallImg;
    birdY -= upTime / 8;
    upTime--;
  } else {
    birdY += fallTime / 8;
    fallTime++;
  }
}

function detectCollision() {
  if (
    (pipes[1].x <= birdX &&
      pipes[1].x + pipeWidth >= birdX &&
      (birdY >= pipes[1].h || birdY <= pipes[1].h - wholeHeight)) ||
    birdY <= 0 ||
    birdY >= canvas.height ||
    (pipes[0].x <= birdX &&
      pipes[0].x + pipeWidth >= birdX &&
      (birdY >= pipes[0].h || birdY <= pipes[0].h - wholeHeight))
  ) {
    clearInterval(interval);
    gameOver();
    document.addEventListener("click", () => document.location.reload());
  }
}

function drawClouds() {
  for (let r = 0; r < cloudRowCount; r++) {
    for (let c = 0; c < cloudColumnCount; c++) {
      clouds[r][c].x = cloudInterval * c + (cloudInterval / 2) * r + cloudPass;
      clouds[r][c].y = (r + 1) * 150 - 100;
      ctx.drawImage(cloudImg, clouds[r][c].x, clouds[r][c].y);
    }
  }
}

function moveClouds() {
  cloudPass -= 0.25;
  if (cloudPass === -cloudWidth) {
    clouds[0].push(clouds[0].shift());
  } else if (cloudPass === -cloudWidth - cloudInterval / 2) {
    clouds[1].push(clouds[1].shift());
    cloudPass = cloudInterval / 2 - cloudWidth;
  }
}

function drawCity() {
  let width = 0;
  for (let i = 0; i < homeCount; i++) {
    homes[i].x = width + homePass;
    width += homes[i].w;
    ctx.drawImage(homeImg[i], homes[i].x, homes[i].y);
  }
}

function moveCity() {
  homePass -= 0.5;
  if (homePass === -homes[0].w) {
    homes.push(homes.shift());
    homeImg.push(homeImg.shift());
    homePass = 0;
  }
}

function drawScore() {
  if (pipes[1].x + pipeWidth === birdX || pipes[0].x + pipeWidth === birdX) {
    score++;
  }
  ctx.font = "18px sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameOver() {
  ctx.font = "bold 56px sans-serif";
  ctx.textAlign = "center";
  if (localStorage.getItem("highScore") < score) {
    localStorage.setItem("highScore", score);
    ctx.fillStyle = "#8bf422";
    ctx.fillText(
      `NEW HIGHSCORE: ${localStorage.getItem("highScore")}!!!`,
      canvas.width / 2,
      canvas.height / 2
    );
    highScoreText.innerHTML = `Highscore: ${localStorage.getItem("highScore")}`;
  } else {
    ctx.fillStyle = "#ff9500";
    ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2);
    ctx.font = "32px sans-serif";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText(
      `Highscore: ${localStorage.getItem("highScore")}`,
      canvas.width / 2,
      canvas.height / 2 + 80
    );
  }
}

function drawBG() {
  drawClouds();
  moveClouds();
  drawCity();
  moveCity();
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBG();
  drawPipes();
  movePipes();
  drawBird();
  moveBird();
  drawScore();
  detectCollision();
}
