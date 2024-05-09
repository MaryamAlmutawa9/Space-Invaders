const startBtn = document.querySelector('.startButton')
const container = document.querySelector('.container')
const shooter = document.querySelector('.shooter')
const fire = document.querySelector('.fire')
const score = document.querySelector('.score')
const containerDim = container.getBoundingClientRect();

let player = {
  scorePlayer : 0,
  firePlayer: false,
  alienspeed : 7,
  speedPlayer : 15,
  gameover: true,
}

let keyV = {};
document.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key === 'ArrowLeft') {
    keyV.left = true;
  } else if (key === 'ArrowRight') {
    keyV.right = true;
  } else if (key === 'ArrowUp' || key === ' ') { 
    if (!player.fire) {
      addShoot();
      }
  }
  });

document.addEventListener("keyup", function (e) {
    let key = e.key;
    if (key === 'ArrowLeft') {
        keyV.left = false;
    } else if (key === 'ArrowRight') {
        keyV.right = false;
          }
    });

    const playAgain = () => {
      startBtn.style.display = "block";
      startBtn.innerHTML = "Play Again";
      player.firePlayer = true;
      fire.classList.add("hide")
    }
    
    const clearInvaders = () =>{
      let tempAliens = document.querySelectorAll(".alien");
      for (let x = 0; x < tempAliens.length; x++) {
        tempAliens[x].parentNode.removeChild(tempAliens[x]);
      }
    }

const startGame = () => {
  if(player.gameover){
    clearInvaders();
    player.gameover = false;
    startBtn.style.display = "none";
    player.alienspeed = 12;
    player.scorePlayer = 0;
    player.firePlayer = false;
    score.textContent = player.scorePlayer;
    moveInvaders(20);
    player.animFrame = requestAnimationFrame(update);
  }
}
startBtn.addEventListener("click", startGame)

const moveInvaders = (num) => {
  let tempWidth = 70;
  let lastCol = containerDim.width - tempWidth;
  let row = {
    x: containerDim.left + 50,
    y: 50
    }
  for (let x = 0; x < num; x++) {
    if (row.x > (lastCol - tempWidth)) {
      row.y += 70;
      row.x = containerDim.left + 50
    }
    creatInvaders(row, tempWidth);
    row.x += tempWidth + 20; 
  }
}

function randomColor() {
  return "#" + Math.random().toString(16).substr(-6);
}

const creatInvaders = (row, tempWidth) =>{
  let alien = document.createElement('div')
  alien.classList.add('alien')
  alien.style.backgroundColor = randomColor()
  alien.style.width = tempWidth + "px"
  alien.xpos = Math.floor(row.x)
  alien.ypos = Math.floor(row.y);
  alien.style.left = alien.xpos + "px";
  alien.style.top = alien.ypos + "px";
  alien.directionMove = 1; 
  container.appendChild(alien)
}

const addShoot = () => {
  player.firePlayer = true;
  fire.classList.remove("hide");
  fire.xpos = (shooter.offsetLeft + (shooter.offsetWidth / 2)); 
  fire.ypos = shooter.offsetTop - 10;
  fire.style.left = fire.xpos + "px";
  fire.style.top = fire.ypos + "px";
}

const checkCollion =(a,b) =>{
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right))
}

function update() {
  if (!player.gameover) {
    let tempAliens = document.querySelectorAll(".alien");
    if (tempAliens.length == 0) {
      player.gameover = true;
      score.innerHTML = "YOU WIN!"
      playAgain(); 
    }
  for (let x = tempAliens.length - 1; x > -1; x--) {
    let el = tempAliens[x];
    if (checkCollion(el, fire)) {
      // player.alienSpeed++;
      player.scorePlayer++;
      score.textContent = player.scorePlayer;
      player.firePlayer = false;
      fire.classList.add("hide");
      el.parentNode.removeChild(el);
      fire.ypos = containerDim.height + 100; //reset the fire position
    }
    //Boundary Check for Alien Position
    if (el.xpos > (containerDim.width - el.offsetWidth) || el.xpos < containerDim.left) {
      el.directionMove *= -1;
      el.ypos += 40;
    if (el.ypos > (shooter.offsetTop - 50)) {
      score.innerHTML = "GAME OVER!"
      player.gameover = true;
      playAgain();
    }
    }
    el.xpos += (player.alienspeed * el.directionMove);
    el.style.left = el.xpos + "px"; //effectively moving the alien left or right depending on the direction
    el.style.top = el.ypos + "px";
}
  let tempPos = shooter.offsetLeft;
  if (player.firePlayer) {
      if (fire.ypos > 0) {
        fire.ypos -= 15;
        fire.style.top = fire.ypos + "px";
      }
      else {
        player.firePlayer = false;
        fire.classList.add("hide");
        fire.ypos = containerDim.height + 100;
      }
  }
  if (keyV.left && tempPos > containerDim.left) {
    tempPos -= player.speedPlayer;
  }
  if (keyV.right && (tempPos + shooter.offsetWidth) < containerDim.right) {
    tempPos += player.speedPlayer;
  }
  shooter.style.left = tempPos + "px";
  player.animFrame = requestAnimationFrame(update);
}
}