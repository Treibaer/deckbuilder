import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';

// Node.js equivalent of __dirname in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// SSL Certificates
const privateKey = fs.readFileSync('/etc/letsencrypt/live/treibaer.de/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/treibaer.de/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all routes to support client-side routing
app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`HTTPS Server is running on port ${port}`);
});
