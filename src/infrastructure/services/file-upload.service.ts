import { Service } from 'typedi';
import fs from 'fs';
import { appConfig } from "@base/config/app";
import { FileTypeNotAllowedException } from "@base/api/exceptions/FileTypeNotAllowedException";

@Service()
export class FileUploadService {
    private readonly ACCEPTED_FILES = ['application/json', 'text/markdown', 'application/txt'];

    public async saveFile(data: { buffer: any; originalname: string, mimetype: string }): Promise<string> {
        try {
            if (!this.ACCEPTED_FILES.includes(data.mimetype)) {
                throw new FileTypeNotAllowedException();
            }

            const path = appConfig.trainDataPath + data.originalname;
            fs.writeFileSync(path, data.buffer);
            return path;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}