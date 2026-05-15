import { DomainException } from '@/Domain/Shared/mod.ts';
import { CustomerSalutationLabel } from '@/Domain/Ticketing/Order/ValueObjects/CostumerSalutation.ts';

export class InvalidCustomerSalutationException extends DomainException {
    public constructor(value: string) {
        super(
            `Invalid salutation '${value}'. Valid values: ${Object.values(CustomerSalutationLabel).join(', ')}`,
        );
    }
}
