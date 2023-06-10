import { appConfig } from './../../config/app';
import { Service } from 'typedi';
import { OpenAI } from 'langchain/llms/openai';
import { HistoryService } from "./history.service";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ICallConfig } from "../models/call-config.model";

@Service()
export class LMMService {
    readonly DEFAULT_TEMPRATURE = 0.7;
    readonly DEFAULT_MODEL_NAME = 'gpt-3.5-turbo';

    constructor(private readonly historyService: HistoryService) { }

    public async call(initalInput: string, historyKey?: string, config?: ICallConfig) {
        try {
            let input = `Human:${initalInput}\n Ai:`
            let model = new OpenAI({
                temperature: this.DEFAULT_TEMPRATURE,
                openAIApiKey: appConfig.openAIApiKey,
                modelName: this.DEFAULT_MODEL_NAME,
                ...(config?.modelName && { modelName: config.modelName }),
                ...(config?.temperature && { temperature: config.temperature }),
            });

            if (config?.useVectorStore) {
                input = await this.includeVectorStore(input);
            }

            if (config?.useHistory) {
                input = this.includeHistory(historyKey, input);
            }

            // call the model
            const response = await model.call(input);

            // save conversation history
            if (historyKey) {
                const hinput = this.includeHistory(historyKey, initalInput);
                this.historyService.addHistory(historyKey, `Human:${hinput}\n Ai:${response}\n`);
            }

            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    private includeHistory(historyKey: string, input: string): string {
        const history = this.historyService.getHistory();
        const myHistory = history[historyKey];
        if (!myHistory) {
            return input;
        }

        const historyText = history[historyKey].join('\n');
        return `History:\n${historyText}\n\n ${input}`;
    }

    private async includeVectorStore(input: string): Promise<string> {
        const store = await HNSWLib.load(appConfig.vectorStorePath, new OpenAIEmbeddings({
            openAIApiKey: appConfig.openAIApiKey
        }));

        const data = await store.similaritySearch(input, 1);
        const context: string[] = [];
        data.forEach((item, i) => {
            context.push(`${item.pageContent}`)
        });

        return `Metadata:\n${context.join('\n')}\n\n${input}`;
    }
}
