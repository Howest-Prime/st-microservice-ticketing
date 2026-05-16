import { InvalidPaymentStatusException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum PaymentStatusState {
    Pending = 'Pending',
    Success = 'Success',
    Failed = 'Failed',
} 

export class PaymentStatus extends ValueObject {
    private constructor(
        public readonly value: PaymentStatusState
    ) {
        super();
    }

    public static create(value: PaymentStatusState): PaymentStatus {
        const newPaymentStatus = new PaymentStatus(value);
        newPaymentStatus.validate();
        return newPaymentStatus;
    }

    public static createFromString(value: string): PaymentStatus {
        const normalized = value.toLowerCase();
        const state = Object.values(PaymentStatusState)
                .find(v => v.toLowerCase() === normalized);

        if (!state) throw new InvalidPaymentStatusException(value);

        return new PaymentStatus(state);
    }

    public validate(): void {
        if (!Object.values(PaymentStatusState).includes(this.value)) {
            throw new InvalidPaymentStatusException(this.value);
        }      
        
    }

    public equals(other: PaymentStatus): boolean {
        return other instanceof PaymentStatus
                && this.value === other.value;  
    }

}