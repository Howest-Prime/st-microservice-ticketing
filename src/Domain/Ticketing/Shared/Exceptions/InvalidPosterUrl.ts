import { DomainException } from '@/Domain/Shared/mod.ts';


export class InvalidPosterUrl extends DomainException {
    public constructor(value: string) {
        super(`Invalid poster URL "${value}": must start with http:// or https://.`);
    }
}
