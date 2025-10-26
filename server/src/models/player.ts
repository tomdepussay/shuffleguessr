import type { Player as PlayerType } from '../types/player.js';
import { Status } from '../types/status.js';

export default class Player implements PlayerType {
    userId!: string;
    connexion!: WebSocket;
    pseudo!: string;
    owner!: boolean;
    status!: Status;

    constructor(player: PlayerType) {
        Object.assign(this, player);
    }
}
