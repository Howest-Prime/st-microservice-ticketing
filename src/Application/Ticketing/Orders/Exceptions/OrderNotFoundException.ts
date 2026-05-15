import { ApplicationException } from '@/Application/Shared/mod.ts';


export class OrderNotFoundException extends ApplicationException {
    public constructor(id: string){
        super(`Order with id ${id} not found.`);
    }
}