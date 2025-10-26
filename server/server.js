// const WebSocket = require('ws');
// const os = require('os');
// const { default: Game } = require('./Game');
// const { default: Player } = require('./Player');
import WebSocket from 'ws';
import os from 'os';
import Game from './src/Model/Game';
import Player from './src/Model/Player';

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();
const games = new Map();

// Fonction utilitaire pour récupérer l'IP locale
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
        for (let config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                return config.address;
            }
        }
    }
    return 'localhost';
}

wss.on('connection', (ws) => {
    console.log('Un client est connecté ✅');

    ws.on('message', (message) => {
        let data = JSON.parse(message);

        if (data.type === 'register') {
            let { userId } = data;
            console.log(`Session enregistrée (${userId})`);
            clients.set(userId, ws);
        }

        if (data.type === 'create') {
            let { userId, pseudo } = data;
            console.log("Création d'une nouvelle partie");

            let game = new Game();
            let player = new Player(ws, userId, pseudo, true);
            game.addPlayer(player);

            games.set(game.code, game);

            ws.send(
                JSON.stringify({
                    type: 'created',
                    code: game.code,
                })
            );
        }

        if (data.type === 'join') {
            let { userId, pseudo, code } = data;
            console.log('Un joueur tente de rejoindre une partie');

            let game = games.get(code);
            if (game) {
                console.log('Un joueur a rejoint la partie');

                let player = new Player(ws, userId, pseudo);
                game.players.push(player);

                ws.send(JSON.stringify({ type: 'joined' }));

                game.players.forEach((p) => {
                    p.connection.send(
                        JSON.stringify({
                            type: 'playerJoined',
                            player: { pseudo: player.pseudo },
                        })
                    );
                });
            } else {
                console.log('Partie inexistante');
                ws.send(JSON.stringify({ type: 'not_exist' }));
            }
        }

        if (data.type === 'players') {
            let { code } = data;
            let game = games.get(code);
            if (game) {
                ws.send(
                    JSON.stringify({
                        type: 'players',
                        players: game.players.map((p) => ({
                            pseudo: p.pseudo,
                        })),
                    })
                );
            }
        }
    });

    ws.on('close', () => {
        console.log('Client déconnecté ❌');
    });
});

const ip = getLocalIp();
console.log(`Serveur WebSocket démarré sur ws://${ip}:8080`);
