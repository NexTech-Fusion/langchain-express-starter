export interface ICallConfig {
    temperature?: number;
    modelName?: string;
    useHistory?: boolean; // if true, the model will be included into the prompt.
    useVectorStore?: boolean; // if true, the model will use the vector store to find the most similar document to the prompt.
}

