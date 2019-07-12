
export class ConnectionPlugin {
    url: string;

    constructor(websocketUrl: string, pvName: string) {
        this.url = websocketUrl;
        console.log(`creating connection to ${pvName}`);
    }
}