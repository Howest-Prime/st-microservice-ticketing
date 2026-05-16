import { Repository } from '@/Domain/Shared/mod.ts';
import { Payment, PaymentId } from '@/Domain/Ticketing/Payment/mod.ts';

export interface PaymentRepository extends Repository<Payment, PaymentId> {
}
