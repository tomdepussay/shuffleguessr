import { Status } from './status.js';

export type Player = {
    userId: string;
    connexion: WebSocket;
    pseudo: string;
    owner: boolean;
    status: Status;
};
