import { FileUploadService } from "@base/infrastructure/services/file-upload.service";
import { JsonController, Post, UploadedFile } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController('/file')
export class FileUploadController {

    constructor(private readonly fileUploadService: FileUploadService) { }

    /**
     * Uploads a file to the train server folder.
     * @param file 
     * @returns realtive file path (.txt, .pdf, .json)
     */
    @Post('/upload')
    public async uploadFile(@UploadedFile('file') file: any): Promise<string> {
        try {
            const filePath = await this.fileUploadService.saveFile(file);
            return filePath;
        } catch (err) {
            throw err;
        }
    }
} 