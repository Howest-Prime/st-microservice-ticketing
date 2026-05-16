import { ApplicationException } from '@/Application/Shared/mod.ts';

export class MovieNotFoundException extends ApplicationException {
    public constructor(id: string) {
        super(`Invalid Movie Id. Movie with Id ${id} not found.`);
    }
}