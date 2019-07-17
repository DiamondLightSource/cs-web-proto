export class SimulatorPlugin {
    url: string;
    value: number;
    localPvs: any;
    onUpdate: (pvName: string, value: any) => void;

    constructor(websocketUrl: string, onUpdate: (pvName: string, value: any) => void) {
        this.url = websocketUrl;
        this.value = 0;
        this.localPvs = {};
        this.onUpdate = onUpdate;
        this.subscribe = this.subscribe.bind(this);
        this.putPv = this.putPv.bind(this);
    }

    subscribe(pvName: string): void {
        console.log(`creating connection to ${pvName}`);
        if (pvName.startsWith('loc://')) {
            this.localPvs[pvName] = 0;
            this.onUpdate(pvName, 0);
        } else if (pvName === 'sim://sine') {
            setInterval(() => (this.onUpdate(pvName, this.getValue(pvName))), 500);
        }
    }

    putPv(pvName: string, value: any) {
        if (pvName.startsWith('loc://')) {
            this.localPvs[pvName] = value;
        }
    }

    getValue(pvName: string): any {
        if (pvName.startsWith('loc://')) {
            return this.localPvs[pvName];
        } else if (pvName === 'sim://sine') {
            return Math.sin(new Date().getSeconds() + new Date().getMilliseconds() * 0.001)
        } else if (pvName === 'sim://random') {
            return Math.random();
        }
    }
}