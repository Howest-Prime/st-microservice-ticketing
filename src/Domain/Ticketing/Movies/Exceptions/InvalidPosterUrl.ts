import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidPosterUrl extends DomainException {
    public constructor(url: string) {
       super(`Invalid poster URL: "${url}".`);
    }
}