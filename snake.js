let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Score and highscore HTML elements
let scoreElement = document.getElementById("score");
let highScoreElement = document.getElementById("highscore");

const boxSize = 20;
let snake = [{ x: 0, y: 0 }];
let score = 0;
let highscore = 0;
let x = 0;
let y = 0;
let dx = boxSize;
let dy = 0;
const maxLength = 5;
let gameSpeed = 100; // Uppdateringshastighet i millisekunder
let gameInterval;

// Fruit properties
let fruit = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};

let fruitImage = new Image();
fruitImage.src = "Bilder/äpplebildnya.png"; // Se till att bilden finns i mappen

// Chili Power-up
let chili = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    active: false
};

let chiliImage = new Image();
chiliImage.src = "Bilder/chilipepper2d-500px.png"; // Lägg till en bild för chilin

// Timer variables
let startTime;
let intervalId;

// Startar timern
function startTimer() {
    startTime = new Date();
    intervalId = setInterval(timerFunction, 1000);
}

// Stoppar timern och returnerar förfluten tid i sekunder
function stopTimer() {
    clearInterval(intervalId);
    let elapsedTime = new Date() - startTime;
    return elapsedTime / 1000;
}

// Loggar tiden varje sekund (valfritt för debugging)
function timerFunction() {
    let elapsedTime = new Date() - startTime;
    console.log(`Elapsed time: ${elapsedTime / 1000} seconds`);
}

// Slumpmässig placering av objekt på spelplanen
function placeObject(object) {
    let validPosition = false;
    while (!validPosition) {
        object.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
        object.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;
        validPosition = true;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === object.x && snake[i].y === object.y) {
                validPosition = false;
                break;
            }
        }
    }
}

// Starta om spelet
function resetGame() {
    let finalTime = stopTimer();
    let gameData = {
        time: finalTime,
        score: score,
        highscore: highscore,
        date: new Date().toLocaleString(),
        note: "Great game! Keep improving!"
    };

    fetch('http://localhost:3000/save-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    score = 0;
    scoreElement.textContent = score;
    snake = [{ x: 0, y: 0 }];
    x = 0;
    y = 0;
    dx = boxSize;
    dy = 0;
    gameSpeed = 100; // Återställ hastigheten
    clearInterval(gameInterval);
    gameInterval = setInterval(update, gameSpeed);
    
    placeObject(fruit);
    placeObject(chili);
    startTimer();
}

// Kollar om ormen krockar med sig själv
function selfCollision(snakehead) {
    for (let i = 0; i < snake.length - 1; i++) {
        if (snakehead.x === snake[i].x && snakehead.y === snake[i].y) {
            resetGame();
            return true;
        }
    }
    return false;
}

// Uppdaterar spelet varje frame
function update() {
    if (!intervalId) startTimer();

    x += dx;
    y += dy;

    // Väggkollision
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        resetGame();
        return;
    }

    let snakehead = { x: x, y: y };

    // Självkollision
    if (selfCollision(snakehead)) return;

    // Om ormen äter frukten
    if (x === fruit.x && y === fruit.y) {
        score++;
        scoreElement.textContent = score;

        if (score > highscore) {
            highscore = score;
            highScoreElement.textContent = highscore;
        }

        placeObject(fruit);
    } else {
        if (snake.length >= maxLength) snake.shift();
    }

    // Om ormen äter chilin
    if (x === chili.x && y === chili.y) {
        chili.active = true;
        placeObject(chili);
        
        // Öka hastigheten temporärt
        if (!chili.active) {
            clearInterval(gameInterval);
            gameSpeed = 50;
            gameInterval = setInterval(update, gameSpeed);

            // Återställ hastigheten efter 5 sekunder
            setTimeout(() => {
                gameSpeed = 100;
                clearInterval(gameInterval);
                gameInterval = setInterval(update, gameSpeed);
                chili.active = false;
            }, 5000);
        }
    }

    snake.push(snakehead);

    // Rensa canvas och rita ormen, frukten och chilin
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    ctx.drawImage(fruitImage, fruit.x, fruit.y, boxSize, boxSize);
    
    if (chili.active) {
        ctx.drawImage(chiliImage, chili.x, chili.y, boxSize*3, boxSize*3);
    }
}

// Byt riktning på ormen
function changeDirection(event) {
    if (event.key === "w" && dy === 0) {
        dx = 0;
        dy = -boxSize;
    } else if (event.key === "s" && dy === 0) {
        dx = 0;
        dy = boxSize;
    } else if (event.key === "a" && dx === 0) {
        dx = -boxSize;
        dy = 0;
    } else if (event.key === "d" && dx === 0) {
        dx = boxSize;
        dy = 0;
    }
}

document.addEventListener("keydown", changeDirection);

// Starta spelet med första intervallen
gameInterval = setInterval(update, gameSpeed);
