import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

// 1. HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// 2. WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    // Robust query parsing:
    // req.url is typically "/?username=Alice"
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const username = parsedUrl.searchParams.get('username');

    // Store username on the socket
    ws.username = username;

    // Test 4: Notify all OTHER clients that this user joined
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'system',
                text: `${ws.username} has joined the chat.`
            }));
        }
    });

    // Test 5: Client sends a message
    ws.on('message', (data) => {
        let text = data.toString();

        try {
            const parsed = JSON.parse(text);
            // Some clients send a JSON object with username and/or text
            if (parsed.username) {
                ws.username = parsed.username;
            }
            if (parsed.text !== undefined) {
                text = parsed.text;
            }
        } catch {
            // Raw text, use as-is
        }

        const chatPayload = JSON.stringify({
            type: 'chat',
            username: ws.username,
            text: text
        });

        // Broadcast to ALL clients (including sender)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(chatPayload);
            }
        });
    });

    // Test 6: Client disconnects
    ws.on('close', () => {
        const leavePayload = JSON.stringify({
            type: 'system',
            text: `${ws.username} has left the chat.`
        });

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(leavePayload);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Chat server is running on http://localhost:${PORT}`);
});