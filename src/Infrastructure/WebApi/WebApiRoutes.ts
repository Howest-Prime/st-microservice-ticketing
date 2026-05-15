import {
    CreateSuggestionController,
    GetSuggestionByIdController,
    ListSuggestionsController,
} from '@/Infrastructure/WebApi/Controllers/mod.ts';
import { type Router, RouterBuilder, type Routes } from '@/Infrastructure/WebApi/Shared/mod.ts';
import { AddCustomerInformationToOrderController } from '@/Infrastructure/WebApi/Controllers/Orders/AddCustomerInformationToOrderController.ts';

export class WebApiRoutes implements Routes {
    map(routerBuilder: RouterBuilder): Router {
        return routerBuilder
            .mapGet(ListSuggestionsController.name, '/api/suggestions')
            .mapPost(CreateSuggestionController.name, '/api/suggestions')
            .mapGet(GetSuggestionByIdController.name, '/api/suggestions/:suggestionId')
            .mapPost(AddCustomerInformationToOrderController.name, '/api/orders/:orderId/customer')
            .build();
    }
}
