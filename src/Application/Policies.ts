import { WhenSuggestionCreatedConsoleLogSuggestion } from '@/Application/Ticketing/Suggestions/mod.ts';
import { WhenPaymentSucceededThenMarkOrderAsPaid } from '@/Application/Ticketing/Payment/mod.ts';
import { SuggestionCreatedDomainEvent } from '@/Domain/Ticketing/Suggestions/mod.ts';
import { PaymentFailed, PaymentSucceeeded } from '@/Domain/Ticketing/Payment/mod.ts';
import { OrderPaid } from '@/Domain/Ticketing/Order/mod.ts';
import { WhenOrderPaidThenReleaseTickets, WhenPaymentFailedThenCancelOrder } from '@/Application/Ticketing/Orders/mod.ts';

export const domainEventPolicies: Map<string, string[]> = new Map([
    [
        SuggestionCreatedDomainEvent.FQDN_VALUE.toString(),
        [WhenSuggestionCreatedConsoleLogSuggestion.name],
    ],
    [
        PaymentSucceeeded.FQDN.toString(),
        [WhenPaymentSucceededThenMarkOrderAsPaid.name],
    ],
    [
        OrderPaid.FQDN.toString(), 
        [WhenOrderPaidThenReleaseTickets.name]
    ],
    [
        PaymentFailed.FQDN.toString(),
        [WhenPaymentFailedThenCancelOrder.name]
    ]
]);
