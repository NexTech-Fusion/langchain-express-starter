import { ICallConfig } from "./call-config.model";

export interface ICallRequest {
    prompt: string;
    historyId: string;
    config?: ICallConfig;
}