import { DomainException } from '@/Domain/Shared/mod.ts';

export class OrderNotOpenForPaymentException extends DomainException {
    public constructor(orderId: string) {
        super(`Order with id ${orderId} is not open for payment`);
    }
}