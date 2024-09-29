# Test Task for Obrio

This repository contains my implementation of the test task for Obrio. The project is a REST API built with NestJS, implementing several modern web technologies for functionality and scalability.

### Technologies

The project leverages the following technologies:

- **TypeScript** – Typed superset of JavaScript.
- **NestJS** – Server-side application framework.
- **Prisma** – ORM for TypeScript/JavaScript with PostgreSQL.
- **PostgreSQL** – Relational database
- **Redis** – In-memory key–value database and message broker.
- **BullMQ** – Job queue using Redis
- **Swagger** – API documentation tool.
- **Jest** – Testing framework for unit and e2e tests.

### Features

- [x] **User Management**: Create and retrieve users.
- [x] **Offer Management**: Create and retrieve offers.
- [x] **Purchase Management**: Create and retrieve purchases, with additional features like a fake API call and a scheduled report after 24 hours.
- [x] **Logging**: Logs requests and errors.
- [x] **API Documentation**: Interactive Swagger docs.
- [x] **Testing**: Unit and e2e tests for full coverage.
- [x] **Database Seeder**: Populate the database with initial data.

### Installation and Setup

Follow these steps to run the application:

**1. Create ```.env``` file**

Create a ```.env``` file in the project root and add the following configuration:

```
# server configuration
PORT=3000

# urls
FAKE_API_URL=https://jsonplaceholder.typicode.com/posts/1

# database configuration
DATABASE_URL=your_database_url

# redis configuration
REDIS_NAME=your_redis_name
REDIS_HOST=your_redis_host
```

**2. Install dependencies**

```bash
npm install
```

**3. Run database migrations**

```bash
npm run db:migrate
```

**3. Seed the database**

```bash
npm db:seed
```

**4. Run the application**

```bash
npm run start:dev
```

Thats it, you can test functionialatity of API

### Running Tests

The following commands will help you run the tests for the application:

**1. Create ```.env.test``` file**

Create a new ```.env.test``` file in the project root and add the following configuration for test environment:

```
# server configuration
PORT=3000

# urls
FAKE_API_URL=https://jsonplaceholder.typicode.com/posts/1

# database configuration
DATABASE_URL=your_test_database_url

# redis configuration
REDIS_NAME=your_redis_test_name
REDIS_HOST=your_redis_test_host
```

**2. Run unit tests**

Run the unit tests to ensure individual components are functioning as expected:

```bash
npm run test
```

**3. Run End-to-End (E2E) tests**

Run the end-to-end tests to simulate user workflows:

```bash
npm run test:e2e
```

**4. Generate test coverage report**

Generate a test coverage report to assess how much of your codebase is covered by tests:

```bash
npm run test:cov
```

### API Documentation

**Access the API and Documentation**
- **Base API URL**: http://localhost:3000/api
- **Swagger API Documentation**: You can explore the available API endpoints and try out requests through the integrated Swagger interface: http://localhost:3000/docs

## Closing Remarks

Thank you for the opportunity to work on this interesting task. Have a nice days :)

> P.S. Looking forward to your review and feedback! ;)
