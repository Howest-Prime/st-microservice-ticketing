import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidOrderStatusTransition extends DomainException {
    public constructor(message: string) {
        super(message);
    }
}
