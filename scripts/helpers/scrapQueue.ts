import axios from 'axios';

export class ScrapQueue {
    calls: (() => Promise<string>)[] = [];

    timeout: boolean = false;
    calling: boolean = false;

    timeoutDuration: number;

    constructor(duration?: number) {
        this.timeoutDuration = duration || 1000 * 3;
    }

    timeoutPromise(time: number) {
        return new Promise((resolve) => {
            if (!this.timeout) {
                resolve(null);
                this.timeout = true;
                return;
            }
            console.log(`Waiting ${time}ms`);
            setTimeout(() => {
                this.timeout = false;
                resolve(null);
            }, time);
        });
    }

    fetch(url: string, options?: any): Promise<any> {
        return new Promise(async (resolve) => {
            this.calls.push(() =>
                axios.get(url, options).then((r) => {
                    resolve(r.data);
                    return r.data;
                }),
            );
            return await this.call();
        });
    }

    async call() {
        if (this.calling) return;
        if (!this.calls.length) {
            return;
        }
        this.calling = true;
        await this.timeoutPromise(this.timeoutDuration);
        await this.calls.shift()();
        this.calling = false;
        await this.call();
    }
}
