import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidMoney extends DomainException {
    public constructor(amount: number, currency: string) {
        super(`Invalid money: amount "${amount}" with currency "${currency}". Amount must be positive and currency must be a 3-letter ISO code.`);
    }
}