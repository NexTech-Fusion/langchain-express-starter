import { JsonController, Post, Body, HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { LMMService } from "../services/lmm.service";
import { ICallRequest } from "../models/call.request.model";

@Service()
@JsonController('/llm')
export class LLMController {

    constructor(private service: LMMService) { }

    /**
     * Calls the langchain model with the given prompt and history id.
     * @param request 
     * @returns text response from the model.
     */
    @Post('/call')
    public async call(@Body() request: ICallRequest): Promise<string> {
        try {
            const response = await this.service.call(request.prompt, request.historyId, request.config);
            return response;
        } catch (err) {
            throw new HttpError(500, err);
        }
    }
}