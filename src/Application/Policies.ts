import { WhenSuggestionCreatedConsoleLogSuggestion } from '@/Application/Ticketing/Suggestions/mod.ts';
import { WhenPaymentSucceededThenMarkOrderAsPaid } from '@/Application/Ticketing/Payment/mod.ts';
import { SuggestionCreatedDomainEvent } from '@/Domain/Ticketing/Suggestions/mod.ts';
import { PaymentSucceeeded } from '@/Domain/Ticketing/Payment/mod.ts';

export const domainEventPolicies: Map<string, string[]> = new Map([
    [
        SuggestionCreatedDomainEvent.FQDN_VALUE.toString(),
        [WhenSuggestionCreatedConsoleLogSuggestion.name],
    ],
    [
        PaymentSucceeeded.FQDN.toString(),
        [WhenPaymentSucceededThenMarkOrderAsPaid.name],
    ],
]);
