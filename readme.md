# Howest Prime Ticketing Microservice

The Ticketing service handles ticket orders, customers, payment status, ticket release, movie data, and suggestions. It exposes a web API and coordinates with other Howest Prime services through asynchronous AMQP messages.

## Responsibilities

- Create orders from movie booking events, associate customer details, and retrieve orders by booking ID.
- Process payment outcomes and update or cancel orders accordingly.
- Release tickets after an order is paid and support order cancellation.
- Store movie information received from the Movies service and manage suggestions.

The HTTP API contract is in [config/openapi.yaml](config/openapi.yaml). The asynchronous message contract is in [config/asyncapi.yaml](config/asyncapi.yaml).

## Architecture and technology

The source is organized into Domain, Application, Infrastructure, and Main layers. It is written in TypeScript and runs on Deno 2. The service uses Oak for HTTP handling, MongoDB for persistence, and AMQP through LavinMQ for messaging. OpenAPI and AsyncAPI files document its external contracts.

## Development

Install Deno 2 and provide the local configuration expected by the run task in `config/.env`. Do not commit credentials or environment-specific connection strings.

Run the unit suite with:

```sh
deno task test
```

For local dependency orchestration, see [config/ticketing-howestprime-dev/docker-compose.yml](config/ticketing-howestprime-dev/docker-compose.yml). The repository’s GitHub Actions workflow checks, lints, tests, measures coverage, builds a container image, and includes an Azure Container Apps deployment job. Deployment relies on configured GitHub variables and secrets.

## Related repositories

- [Android client](https://github.com/Howest-Prime/st-client-mobile)
- [Movies microservice](https://github.com/Howest-Prime/st-microservice-movies)

## How to start the service
- docker compose -f config/ticketing-howestprime-dev/docker-compose.yml down
- docker compose -f config/ticketing-howestprime-dev/docker-compose.yml up -d
