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

// Fruktens position (rättad slumpmässig position)
let fruit = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};

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
        return;  // Om kollision sker, avsluta funktionen för att förhindra fortsatt uppdatering
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

        // Slumpa ny fruktposition
        fruit.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
        fruit.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;
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

    // Rita frukten
    ctx.fillStyle = "red";
    ctx.fillRect(fruit.x, fruit.y, boxSize, boxSize);
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

// Starta en loop som uppdaterar spelet varje 100 millisekunder
setInterval(update, 100);
