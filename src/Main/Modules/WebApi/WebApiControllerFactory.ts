import { ServiceProvider } from '@domaincrafters/di';

import {
    CreateSuggestionUseCase,
    type CreateSuggestionUseCaseInput,
    GetSuggestionByIdQueryUseCase,
    type GetSuggestionByIdQueryUseCaseInput,
    ListSuggestionsQueryUseCase,
} from '@/Application/Ticketing/Suggestions/mod.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import type {
    SuggestionByIdReadModel,
    SuggestionListItemReadModel,
} from '@/Application/Ports/Queries/mod.ts';
import {
    CreateSuggestionController,
    GetSuggestionByIdController,
    ListSuggestionsController,
} from '@/Infrastructure/WebApi/Controllers/mod.ts';
import {
    type ControllerFactory,
    type RouterContext,
    type WebApiController,
} from '@/Infrastructure/WebApi/Shared/mod.ts';
import { IllegalStateException } from '@domaincrafters/std';
import { AddCustomerInformationToOrderController } from '@/Infrastructure/WebApi/Controllers/Orders/mod.ts';
import { AddCustomerToOrderUseCase, AddCustomerToOrderUseCaseInput } from '@/Application/Ticketing/Orders/mod.ts';

export class WebApiControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
    }

    async create(ctx: RouterContext<string>): Promise<WebApiController> {
        if (!ctx.routeName) {
            throw new IllegalStateException('Route name is not defined');
        }

        switch (ctx.routeName) {
            case CreateSuggestionController.name:
                return await this.createCreateSuggestionController();
            case ListSuggestionsController.name:
                return await this.createListSuggestionsController();
            case GetSuggestionByIdController.name:
                return await this.createGetSuggestionByIdController();
            case AddCustomerInformationToOrderController.name:
                return await this.createAddCustomerInformationToOrderController();

            default:
                throw new IllegalStateException(
                    `Controller for route ${ctx.routeName} is not defined`,
                );
        }
    }
    private async createAddCustomerInformationToOrderController(): Promise<AddCustomerInformationToOrderController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<AddCustomerToOrderUseCaseInput, void>
        >(AddCustomerToOrderUseCase.name)).getOrThrow();

        return new AddCustomerInformationToOrderController(useCase);
    }

    private async createCreateSuggestionController(): Promise<CreateSuggestionController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<CreateSuggestionUseCaseInput, string>
        >(CreateSuggestionUseCase.name)).getOrThrow();

        return new CreateSuggestionController(useCase);
    }

    private async createListSuggestionsController(): Promise<ListSuggestionsController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<void, SuggestionListItemReadModel[]>
        >(ListSuggestionsQueryUseCase.name)).getOrThrow();

        return new ListSuggestionsController(useCase);
    }

    private async createGetSuggestionByIdController(): Promise<GetSuggestionByIdController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<GetSuggestionByIdQueryUseCaseInput, SuggestionByIdReadModel>
        >(GetSuggestionByIdQueryUseCase.name)).getOrThrow();

        return new GetSuggestionByIdController(useCase);
    }
}
