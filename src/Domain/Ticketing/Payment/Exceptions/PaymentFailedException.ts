import { DomainException } from '@/Domain/Shared/mod.ts';

export class PaymentFailedException extends DomainException {
    constructor(paymentId: string, failureReason: string) {
        super(`Payment with ID ${paymentId} failed. Reason: ${failureReason}`);
    }
}