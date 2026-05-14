import { MongoDbClient, MongoDbRepository } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Order } from '@/Domain/Ticketing/Order/Order.ts';
import { OrderId } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderDocumentMapper } from './Mappers/OrderDocumentMapper.ts';

export class MongoDbOrderRepository extends MongoDbRepository<Order, OrderId> {
    static override readonly collectionName: string = 'orders';

    constructor(
        client: MongoDbClient, 
        mapper: OrderDocumentMapper
    ) {
        super(client, mapper, MongoDbOrderRepository.collectionName);
    }

    override get entityName(): string {
        return Order.name;
    }
}
