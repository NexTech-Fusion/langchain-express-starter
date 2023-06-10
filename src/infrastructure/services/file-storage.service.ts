import { HistoryService } from '../../api/services/history.service';
import { Service } from "typedi";
import { appConfig } from "@base/config/app";
import fs from 'fs';

@Service()
export class FileStorageService {
    private historyService: HistoryService;

    public setHistoryService(historyService: HistoryService) {
        this.historyService = historyService;
    }

    public saveAll() {
        try {
            this.saveHistroy();
        } catch (e) {
            console.log(e);
        }
    }

    public saveHistroy() {
        try {
            fs.writeFileSync(appConfig.historyPath, JSON.stringify(this.historyService.getHistory()));
        } catch (e) {
            console.error(e)
        }
    }

    public loadHistory() {
        try {
            const history = JSON.parse(fs.readFileSync(appConfig.historyPath, 'utf8'));
            this.historyService.setHistory(history);
        } catch (e) {
            console.log(e);
        }
    }
}