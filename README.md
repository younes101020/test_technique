# Car API REST

Fake car service REST API based on hono.

## Features

- CRUD on cars and brand entities including relations.
- Authentication session based on JWT + Cookie.
- Pagination on lists.
- Protected routes for authenticated users.
- Basic RBAC with users and admin roles.
- Fully documented API

## Getting Started

### Prerequisites

- NodeJS
- Yarn
- A running PostgreSQL instance with two empty databases (dev, test).

### Installation

Install dependencies.
```bash
$ yarn install
```

Next, create a **.env** file at the root of the project and paste the content of the .**env.example** file into it, and fill in the environment variables DATABASE_URL and AUTH_SECRET.

## Start

```bash
# launch dev environment
$ yarn dev
# OR
# start production
$ yarn build && yarn start
```

Then go to http://localhost:9999/reference, where you'll find the API documentation.

## Integration tests for CRUD

Like in the development step, replace the environment variables DATABASE_URL and AUTH_SECRET of **.env.test** file. Be careful, the DATABASE_URL variable must point to your second clean postgres database which is dedicated to testing.

```bash
$ yarn test
```