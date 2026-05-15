import { Repository } from '@/Domain/Shared/mod.ts';
import { Order } from '@/Domain/Ticketing/Order/Order.ts';
import { OrderId } from '@/Domain/Ticketing/Order/EntityIds.ts';
import { Optional } from '@domaincrafters/std';

export interface OrderRepository extends Repository<Order, OrderId> {
    byExternalId(externalId: string): Promise<Optional<Order>>;
}
