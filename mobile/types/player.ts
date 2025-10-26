import { Status } from "./status";

export type Player = {
    id: string;
    connection: WebSocket;
    pseudo: string;
    owner: boolean;
    status: Status
};
