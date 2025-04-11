const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

function logRequest(req, label) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const log = `[${new Date().toISOString()}] [${label}] IP: ${ip} | UA: ${userAgent}\n`;

    console.log(log);
    fs.appendFileSync('ip_log.txt', log);
}

// Root route just to show the server is live
app.get('/', (req, res) => {
    res.send('🔍 IP Logger is running. Try /image.png or /redirect instead.');
});

// 🔥 Method 1: Direct image with normal headers
app.get('/image.png', (req, res) => {
    logRequest(req, 'NORMAL');
    res.sendFile(__dirname + '/cursedemoji.png');
});

// 🌀 Method 2: Image served as text/html (sneaky Content-Type)
app.get('/sneaky.png', (req, res) => {
    logRequest(req, 'SNEAKY-TYPE');
    res.set('Content-Type', 'text/html'); // Not image!
    res.sendFile(__dirname + '/cursedemoji.png');
});

// 🔁 Method 3: Redirect to real image (double request test)
app.get('/redirect.png', (req, res) => {
    logRequest(req, 'REDIRECT-STAGE1');
    // Replace with your real file or hosted image
    res.redirect('https://turn-alternate-lucia-acrylic.trycloudflare.com/redirect.png');
});

// For testing the final redirect target (optional)
app.get('/final.png', (req, res) => {
    logRequest(req, 'REDIRECT-STAGE2');
    res.sendFile(__dirname + '/cursedemoji.png');
});

app.listen(PORT, () => {
    console.log(`🚀 IP Logger running at http://localhost:${PORT}`);
});
