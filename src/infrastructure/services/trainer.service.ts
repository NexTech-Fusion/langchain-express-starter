import { appConfig } from './../../config/app';
import { Service } from "typedi";
import glob from 'glob';
import fs from 'fs'
import { CharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

@Service()
export class TrainerService {
    readonly CHUNK_SIZE = 2000;
    readonly DOCUMENT_TYPES = "{json,txt,md}"

    public async train() {
        try {

            const path = appConfig.trainDataPath;
            const data = [];
            const filePaths: string[] = await new Promise((resolve, reject) =>
                glob(path + '/**/*.' + this.DOCUMENT_TYPES, (err: Error, files: any) => err ? reject(err) : resolve(files))
            );
            console.log('training files found: ' + filePaths.length);

            for (const filePath of filePaths) {
                data.push(fs.readFileSync(filePath, 'utf-8'));
            }

            const textSplitter = new CharacterTextSplitter({
                chunkSize: this.CHUNK_SIZE,
                separator: "\n"
            });

            let docs: any[] = [];
            for (const d of data) {
                const docOutput = await textSplitter.splitText(d);
                docs = [...docs, ...docOutput];
            }

            const store = await HNSWLib.fromTexts(
                docs,
                docs.map((_, i) => ({ id: i })),
                new OpenAIEmbeddings({
                    openAIApiKey: appConfig.openAIApiKey
                })
            )

            store.save(appConfig.vectorStorePath)
            console.log('training finished');
        } catch (e) {
            console.log('training failed');
            console.log(e);
        }
    }
}