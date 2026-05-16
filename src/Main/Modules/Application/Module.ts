import { ServiceCollection, ServiceProvider } from '@domaincrafters/di';

import {
    ListSuggestionsQueryUseCase,
    WhenSuggestionCreatedConsoleLogSuggestion,
} from '@/Application/Ticketing/Suggestions/mod.ts';
import { domainEventPolicies } from '@/Application/mod.ts';
import type { Logger, UseCase } from '@/Application/Ports/mod.ts';
import type {
    GetOrderByBookingIdData,
    SuggestionListItemReadModel,
} from '@/Application/Ports/Queries/mod.ts';
import { DomainEventRegistry } from '@/Infrastructure/Events/Shared/mod.ts';
import { PolicyDomainEventListener } from '@/Infrastructure/Events/mod.ts';
import { MongoDbListSuggestionsQuery } from '@/Infrastructure/Persistence/MongoDb/Queries/mod.ts';
import { MongoDbUnitOfWork } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Config, ConsoleLogger } from '@/Infrastructure/Shared/mod.ts';
import { Module } from '@/Main/Modules/Shared/mod.ts';
import { OnlinePaymentService } from '@/Infrastructure/Payment/mod.ts';
import { SaveMovieUseCase, SaveMovieUseCaseInput } from '@/Application/Ticketing/Movies/mod.ts';
import {
    AddCustomerToOrderUseCase,
    AddCustomerToOrderUseCaseInput,
    CreateOrderFromBookingInput,
    CreateOrderFromBookingUseCase,
    GetOrderByBookingIdInput,
    GetOrderByBookingIdUseCase,
    MarkOrderAsPaidInput,
    MarkOrderAsPaidUseCase,
    ReleaseTicketInput,
    ReleaseTicketUseCase,
    WhenOrderPaidThenReleaseTickets,
} from '@/Application/Ticketing/Orders/mod.ts';
import { MongoDbGetOrderByBookingIdQuery } from '@/Infrastructure/Persistence/MongoDb/Queries/Orders/mod.ts';
import {
    PayOrderInput,
    PayOrderOutput,
    PayOrderUseCase,
    WhenPaymentSucceededThenMarkOrderAsPaid,
} from '@/Application/Ticketing/Payment/mod.ts';

export class Application implements Module {
    add(serviceCollection: ServiceCollection, _config: Config): void {
        console.log('Application module added');
        this.addUseCases(serviceCollection);
        this.addPolicies(serviceCollection);

        serviceCollection.addScoped(
            OnlinePaymentService.name,
            () => Promise.resolve(new OnlinePaymentService()),
        );
    }

    private addUseCases(serviceCollection: ServiceCollection): void {
        serviceCollection.addScoped(
            SaveMovieUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(
                    MongoDbUnitOfWork.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<SaveMovieUseCaseInput, string> = new SaveMovieUseCase(
                    unitOfWork,
                    logger,
                );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            CreateOrderFromBookingUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(
                    MongoDbUnitOfWork.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<CreateOrderFromBookingInput, string> =
                    new CreateOrderFromBookingUseCase(
                        unitOfWork,
                        logger,
                    );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            AddCustomerToOrderUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(
                    MongoDbUnitOfWork.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<AddCustomerToOrderUseCaseInput, void> =
                    new AddCustomerToOrderUseCase(
                        unitOfWork,
                        logger,
                    );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            ListSuggestionsQueryUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const query = (await serviceProvider.getService<MongoDbListSuggestionsQuery>(
                    MongoDbListSuggestionsQuery.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<void, SuggestionListItemReadModel[]> =
                    new ListSuggestionsQueryUseCase(
                        query,
                        logger,
                    );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            GetOrderByBookingIdUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const query = (await serviceProvider.getService<MongoDbGetOrderByBookingIdQuery>(
                    MongoDbGetOrderByBookingIdQuery.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<
                    GetOrderByBookingIdInput,
                    GetOrderByBookingIdData
                > = new GetOrderByBookingIdUseCase(
                    query,
                    logger,
                );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            PayOrderUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(
                    MongoDbUnitOfWork.name,
                )).getOrThrow();

                const paymentService = (await serviceProvider.getService<OnlinePaymentService>(
                    OnlinePaymentService.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<PayOrderInput, PayOrderOutput> = new PayOrderUseCase(
                    unitOfWork,
                    paymentService,
                    logger,
                );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            MarkOrderAsPaidUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(
                    MongoDbUnitOfWork.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<MarkOrderAsPaidInput, void> = new MarkOrderAsPaidUseCase(
                    unitOfWork,
                    logger,
                );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            ReleaseTicketUseCase.name,
            async (serviceProvider: ServiceProvider) => {
                const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(
                    MongoDbUnitOfWork.name,
                )).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<ReleaseTicketInput, void> = new ReleaseTicketUseCase(
                    unitOfWork,
                    logger,
                );

                return useCase;
            }
        );
    }

    private addPolicies(serviceCollection: ServiceCollection): void {
        serviceCollection.addScoped(
            WhenSuggestionCreatedConsoleLogSuggestion.name,
            async (serviceProvider: ServiceProvider) => {
                const logger = (await serviceProvider.getService<Logger>(
                    ConsoleLogger.name,
                )).getOrThrow();

                return new WhenSuggestionCreatedConsoleLogSuggestion(logger);
            },
        );

        serviceCollection.addScoped(
            WhenPaymentSucceededThenMarkOrderAsPaid.name,
            async (serviceProvider: ServiceProvider) => {
                const markOrderAsPaidUseCase = (await serviceProvider.getService<
                    UseCase<MarkOrderAsPaidInput, void>
                >(MarkOrderAsPaidUseCase.name)).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(
                    ConsoleLogger.name,
                )).getOrThrow();

                return new WhenPaymentSucceededThenMarkOrderAsPaid(markOrderAsPaidUseCase, logger);
            },
        );

        serviceCollection.addScoped(
            WhenOrderPaidThenReleaseTickets.name,
            async (serviceProvider: ServiceProvider) => {
                const releaseTicketUseCase = (await serviceProvider.getService<
                    UseCase<ReleaseTicketInput, void>
                >(ReleaseTicketUseCase.name)).getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(
                    ConsoleLogger.name,
                )).getOrThrow();

                return new WhenOrderPaidThenReleaseTickets(releaseTicketUseCase, logger);
            },
        );
    }

    async use(serviceProvider: ServiceProvider): Promise<void> {
        console.log('Application module use - Wiring policyregistry');

        // Get event bus from DI container
        const eventListener = (await serviceProvider.getService<PolicyDomainEventListener>(
            'PolicyDomainEventListener',
        ))
            .getOrThrow();

        // Create policy registry (Infrastructure)
        const policyregistry = new DomainEventRegistry([eventListener]);

        console.log(
            'Application module use - Registering policies from Application layer mapping',
            domainEventPolicies,
        );

        // Register policies from Application layer mapping
        // Policy instances are NOT resolved here - the EventBus will resolve them
        // with a fresh scope when handling each event
        policyregistry.registerFromMapping(domainEventPolicies);

        // Subscribe all policyregistry to event bus
        await policyregistry.subscribeAll();
    }

    static create(): Module {
        return new Application();
    }
}
