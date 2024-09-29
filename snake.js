let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Konstant boxstorlek och ormen är en array
const boxSize = 20;
let snake = [];

// Startpositionen
let x = 0;
let y = 0;

// Hur trail/ormen ska ritas ut
let dx = boxSize;
let dy = 0;

// Maximala längden på ormen, sätts till ett stort värde för att det ska vara "oändligt"
const maxLength = 8;

// Lägg till startpositionen i ormen
snake.push({ x: x, y: y });

// Funktionen som uppdaterar spelet varje gång
function update() {
    // Uppdatera ormens position
    x += dx;
    y += dy;

    // Lägg till den nya positionen till ormen
    snake.push({ x: x, y: y });

    // Begränsa längden på ormen till maxLength
    if (snake.length > maxLength) {
        snake.shift(); // Ta bort det äldsta blocket om ormens längd överstiger maxLength
    }

    // Rensa canvas för att kunna rita om
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rita alla block i ormen
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "black";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize); // Rita blocken
    }
}

// Funktion för att kontrollera tangenttryckningar och ändra riktning
function changeDirection(event) {
    if (event.key === "w" && dy === 0) {
        dx = 0;
        dy = -boxSize;
    } else if (event.key === "s"  && dy === 0) {
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


// Starta en loop som uppdaterar spelet varje 100 millisekunder
setInterval(update, 100);
