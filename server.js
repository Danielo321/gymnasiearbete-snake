const express = require('express');
const cors = require('cors');
const fs = require('fs');  // Inbyggd modul för att hantera filer
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Route to save game data
app.post('/save-game', (req, res) => {
    const gameData = req.body;

    // Logga spelets data till serverns konsol (kan tas bort om du inte vill ha det)
    console.log(gameData); 

    // Spara spelets data i en JSON-fil
    fs.readFile('gameData.json', (err, data) => {
        if (err) {
            // Om filen inte finns, skapa en ny fil med tom array
            fs.writeFile('gameData.json', JSON.stringify([gameData], null, 2), (err) => {
                if (err) throw err;
                console.log('Data saved to new file!');
            });
        } else {
            // Om filen finns, lägg till ny data
            const existingData = JSON.parse(data);
            existingData.push(gameData);

            fs.writeFile('gameData.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) throw err;
                console.log('Game data saved!');
            });
        }
    });

    // Skicka tillbaka svar till frontend
    res.send('Game data saved successfully!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
