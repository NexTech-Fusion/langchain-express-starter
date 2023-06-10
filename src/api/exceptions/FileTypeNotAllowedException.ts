
import { NotAcceptableError, } from 'routing-controllers';

export class FileTypeNotAllowedException extends NotAcceptableError {
    constructor() {
        super('File type is not allowed!');
    }
}
