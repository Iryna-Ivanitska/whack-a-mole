const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const highScoreBoard = document.querySelector('.high-score');
const score = document.querySelector('.your-score');
const level = document.querySelector('.level');
const startButton = document.querySelector('.button');
const levelContainer = document.querySelector('.level-container');
const sound = document.querySelector('#hit');
let setElement = document.querySelector('.set-element');
let lastHole, myHighScore;
let currentScore = 0;
let lev = 1;
let levelCounter = [,];
let molesActive = 1;
let endLevel = false;


if (!localStorage.highScore) localStorage.setItem('highScore', 0);
myHighScore = localStorage.getItem('highScore');

const levels = {
    '1': 1400,
    '2': 1300,
    '3': 1200,
    '4': 1100,
    '5': 900,
    '6': 700,
    '7': 600,
    '8': 500,
    '9': 400,
    '10': 300,
    '11': 200,
}

const levelNumber = Object.keys(levels).length;
for (let i = 1; i <= levelNumber; i++) {
    levelCounter.push(i*5);
}

myHighScore = localStorage.getItem('highScore');
highScoreBoard.textContent = myHighScore;

function randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (lastHole === hole) {
        return randomHole(holes);
    }

    lastHole = hole;
    return hole;
}

function removeLevel() {
   setElement.style.display = 'none';
    
}
function showLevel(lev) {
    setElement.style.animation = 'levelFading 1s ease-in';
    setElement.textContent = `Level: ${lev}`;
    setElement.style.display = 'block';
    setElement.addEventListener('animationend', removeLevel); 
}


function peep(lev) {
    const time = levels[`${lev}`];
    if (lev <= levelNumber) level.textContent = lev;
    const hole = randomHole(holes);
    hole.classList.add('active');
  
    setTimeout( () => {
        
        hole.classList.remove('active');
        if (levelCounter.includes(molesActive))  {
            lev = levelCounter.indexOf(molesActive) + 1;
            showLevel(lev);
        } 
        if (!endLevel) peep(lev);
        molesActive++;
        if (molesActive === levelCounter.length*5) {
            // alert('game over');
            startButton.disabled = false;
            endLevel = true;
            setElement.textContent = 'GAME OVER';
            if (lev === levelNumber+1) {
                setElement.style.display = 'block';
                setElement.style.opacity = 1;
                setElement.style.animation = 'none';
            }
            
            if (myHighScore < currentScore) {
                localStorage['highScore'] = currentScore;
                myHighScore = localStorage.getItem('highScore');
                highScoreBoard.textContent = myHighScore;
            }
    }
    }, time)
   
}

function smack(e) {
    if (!e.isTrusted) return;
    sound.play();
    e.path[1].classList.remove('active');
    currentScore++;
    score.textContent = currentScore;
    return currentScore;
}

function addHammer(e) {
    let hammer = document.createElement("div");
    hammer.classList.add("hammer"); 
    e.path[1].append(hammer);
    e.path[1].addEventListener('mouseup', removeHammer)
    e.path[1].onmousemove = removeHammer;
}
function removeHammer(e) {
    setTimeout( () => {
        let currentHammer = document.querySelector(".hammer");
        if (currentHammer) currentHammer.remove();
    }, 50)
}


const startGame = (e) => {
    showLevel(1)
    startButton.disabled = true;
    levelContainer.style.visibility = 'visible';
    molesActive = 0;
    currentScore = 0; 
    endLevel = false;
    peep(lev);
    if (levelCounter.includes(molesActive)) endLevel = true;
}

startButton.addEventListener( 'click', startGame)

moles.forEach( el => el.addEventListener('click', smack))

moles.forEach( el => el.addEventListener('mousedown', addHammer))

