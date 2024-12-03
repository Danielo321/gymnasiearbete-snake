let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Hämta score- och highscore-element från HTML
let scoreElement = document.getElementById("score");
let highScoreElement = document.getElementById("highscore");

// Konstant boxstorlek och ormen är en array
const boxSize = 20;
let snake = [];
let score = 0;
let highscore = 0; // Variabel för highscore

// Startposition för ormen
let x = 0;
let y = 0;

// Hur ormen ska röra sig
let dx = boxSize;
let dy = 0;

// Maximala längden på ormen
const maxLength = 5;

// Bilden på Powerup-frukten
let powerFruitImage = new Image();
powerFruitImage.src = "chilipixel3.png";

// Bilden på frukten
let fruitImage = new Image();
fruitImage.src = "pixelwatermelon.png";

// Variabeln för spel-intervallet som bestämmer hur snabt ormen åker
interval = 100

// Powerup-Fruktens position
let powerFruit = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};

// Fruktens position
let fruit = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};

// Funktion för att göra ormen snabbare när den rör en Powerup
let gameInterval; // Lagrar spelintervallet

// Startar spelet med ursprungliga intervallet
function startGameInterval() {
    clearInterval(gameInterval);
    gameInterval = setInterval(update, interval);
}

// Ändrar spelintervallet om ormen rör en Powerup
function powerupIn() {
    interval = 50;
    startGameInterval();
}

// Ändrar spelintervallet tillbaka efter 5 sekunder
function powerupOut() {
    interval = 100;
    startGameInterval();
}

startGameInterval();

// Funktion för att slumpa en ny position för Powerup-frukten
function placePowerFruit() {
    let validPosition = false;

    while (!validPosition) {
        powerFruit.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
        powerFruit.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;

        validPosition = true; // Anta att positionen är giltig
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === powerFruit.x && snake[i].y === powerFruit.y) {
                validPosition = false; // Positionen är inte giltig om den ligger på ormen
                break; // Avbryt loopen

            }
        }
    }
}

// Funktion för att slumpa en ny position för frukten
function placefruit() {
    let validPosition = false;

    while (!validPosition) {
        fruit.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
        fruit.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;

        validPosition = true; // Anta att positionen är giltig
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === fruit.x && snake[i].y === fruit.y) {
                validPosition = false; // Positionen är inte giltig om den ligger på ormen
                break; // Avbryt loopen

            }
        }
    }
}

// Lägg till startpositionen i ormen
snake.push({ x: x, y: y });

// Funktionen som återställer spelet vid kollision
function resetGame() {
    alert("Game over!"); // Visa ett meddelande vid kollision
    score = 0; // Återställ poängen
    scoreElement.textContent = score; // Återställ poängen i HTML
    snake = [{ x: 0, y: 0 }]; // Återställ ormen till startpositionen
    x = 0;
    y = 0;
    dx = boxSize;
    dy = 0;
}

// Funktion för självkollision
function selfCollision(snakehead) {
    for (let i = 0; i < snake.length - 1; i++) {
        if (snakehead.x === snake[i].x && snakehead.y === snake[i].y) {
            resetGame(); // Återställ spelet om en kollision upptäcks
            return true;
        }
    }
    return false; // Ingen kollision upptäckt
}

// Funktionen som uppdaterar spelet varje gång
function update() {
    // Uppdatera ormens position
    x += dx;
    y += dy;

    // Kolla om ormen träffar en vägg
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        resetGame(); // Återställ spelet om ormen träffar en vägg
        return; // Avsluta funktionen så att inget mer ritas ut efter kollision
    }

    // Skapa en ny huvudposition
    let snakehead = { x: x, y: y };

    // Kolla om ormen träffar sig själv
    if (selfCollision(snakehead)) {
        return; // Om kollision sker, avsluta funktionen för att förhindra fortsatt uppdatering
    }

    // Kolla om ormen träffar Powerup-frukten
    if (x === powerFruit.x && y === powerFruit.y) {
        score++; // Öka poängen
        scoreElement.textContent = score; // Uppdatera poängen i HTML

        //Gör ormen snabbare
        powerupIn();
        
        //Gör den lika snabb som förut
        setTimeout(powerupOut, 5000);

        // Kontrollera och uppdatera highscore
        if (score > highscore) {
            highscore = score;
            highScoreElement.textContent = highscore; // Uppdatera highscore i HTML
        }

        // Placera Powerup-frukten på en ny position
        placePowerFruit(); // Använd vår nya funktion
    } else {
        // Ta bort det äldsta blocket om ormen inte äter frukten
        if (snake.length >= maxLength) {
            snake.shift();
        }
    }

    // Kolla om ormen träffar frukten
    if (x === fruit.x && y === fruit.y) {
        score++; // Öka poängen
        scoreElement.textContent = score; // Uppdatera poängen i HTML

        // Kontrollera och uppdatera highscore
        if (score > highscore) {
            highscore = score;
            highScoreElement.textContent = highscore; // Uppdatera highscore i HTML
        }

        // Placera Powerup-frukten på en ny position
        placefruit(); // Använd vår nya funktion
    } else {
        // Ta bort det äldsta blocket om ormen inte äter frukten
        if (snake.length >= maxLength) {
            snake.shift();
        }
    }

    // Lägg till den nya positionen till ormen
    snake.push(snakehead);

    // Rensa canvas för att kunna rita om
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rita alla block i ormen
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "black";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize); // Rita blocken
    }

    // Rita Power-up frukten
    ctx.drawImage(powerFruitImage, powerFruit.x, powerFruit.y,boxSize, boxSize);

    // Rita Power-up frukten
    ctx.drawImage(fruitImage, fruit.x, fruit.y,boxSize, boxSize);
}

// Funktion för att kontrollera tangenttryckningar och ändra riktning
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

// Lyssna på tangenttryckningar för att ändra riktning
document.addEventListener("keydown", changeDirection);

// Starta en loop som uppdaterar spelet varje 200 millisekunder
setInterval(update, 100);


//IDÈ Ormen blir röd när den käkar chilin // 