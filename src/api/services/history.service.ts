import { Service } from "typedi";

@Service()
export class HistoryService {
    private history = {} as { [key: string]: string[] };

    public setHistory(data: any) {
        this.history = data;
    }

    public getHistory() {
        return this.history;
    }

    public addHistory(historyKey: string, value: string) {
        if (!this.history[historyKey]) {
            this.history[historyKey] = [];
        }

        this.history[historyKey].push(value);
    }
}