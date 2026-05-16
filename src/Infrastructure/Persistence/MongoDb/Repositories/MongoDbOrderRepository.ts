import {
    MongoDbClient,
    MongoDbRepository,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Order, OrderRepository } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderId } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderDocumentMapper } from './Mappers/OrderDocumentMapper.ts';
import { Optional } from '@domaincrafters/std';
import { Document, Filter } from '@mongodb';

export class MongoDbOrderRepository extends MongoDbRepository<Order, OrderId>
    implements OrderRepository {
    static override readonly collectionName: string = 'orders';

    constructor(
        client: MongoDbClient,
        mapper: OrderDocumentMapper
    ) {
        super(client, mapper, MongoDbOrderRepository.collectionName);
    }

    async byExternalId(externalId: string): Promise<Optional<Order>> {
        if (!externalId?.trim()) {
            return Optional.empty<Order>();
        }

        const document = await this._dbClient.findDocument(
            { externalId } as unknown as Filter<Document>,
            MongoDbOrderRepository.collectionName,
        );

        return document.map(
            this._documentMapper.reconstitute.bind(this._documentMapper),
        );
    }

    override get entityName(): string {
        return Order.name;
    }
}
