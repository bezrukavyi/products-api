# Products API

A NestJS-based API for managing product data, featuring endpoints for creating, updating, retrieving, and deleting products. Built with MongoDB via Mongoose, JWT for authentication, and Swagger for API documentation.

- [Products API](#products-api)
  - [Core Dependencies](#core-dependencies)
  - [How to run](#how-to-run)
  - [How to use](#how-to-use)
  - [Authentication](#authentication)
    - [Tokens examples](#tokens-examples)
      - [readWrite](#readwrite)
      - [readOnly](#readonly)
  - [Development](#development)
  - [Run tests](#run-tests)
  - [Generate data](#generate-data)
  - [Compile and run the project](#compile-and-run-the-project)
  - [API Documentation](#api-documentation)
    - [Permissions](#permissions)
    - [Usage](#usage)
    - [Private and Public keys](#private-and-public-keys)
  - [Deployment](#deployment)

## Core Dependencies

- **NestJS**: Primary framework for building scalable server-side applications.
- **jsonwebtoken**: Library for handling JWT-based authentication.
- **mongoose**: Object Data Modeling (ODM) library for MongoDB integration.
- **@nestjs/swagger**: Auto-generates API documentation.
- **Docker**: Containerization platform for easy deployment.

## How to run

```bash
$ cp .env.example .env

# Run server
$ docker-compose -p products-api up --build

# Generate data
docker exec -it nestjs npm run seed:products
```

## How to use

After that the API will be available at `http://localhost:3001`

The documentation will be available at `http://localhost:3001/api/docs`

Please see documentation from [API Documentation](#api-documentation) section below.
You can use tokens from the [Tokens examples](#tokens-examples) section below.

## Authentication

This section provides JWT tokens for access permissions. Use these tokens to authenticate and authorize actions within the system, based on the required access level.

### Tokens examples

#### readWrite

```bash
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9uIjoicmVhZFdyaXRlIiwiaWF0IjoxNzMwMjQwMjY3LCJleHAiOjE3MzI4MzIyNjd9.a9OxWlj8zlUL8kc-w4zyxhVqZq8h1yJV58V-mAlSqqiKHb6feokfn1B4Jcy2R6e8LtchOArpaC1BUefm6lI13kqfgr7kuBXhLXmymsLMjKwbVWleOrZe2tkJDd9M23S913g2ZN2aDLXvdy4aE-LkVXzvvtPzmgRPjglNI6fbjNs3hBfwm9ZoFJDCBGVFdmPgsk-M9zvA-HbhCX25SZgDG1H7XDcjyrJGDpHku3J-DD9tAJ0I9Ac5Pc_hrCyJLZEfoFSk8tfYmA1PlGMykC4IC45kBF9-wz-OIyaypD8o32vHn-M1s8IaSz2sJKjeL43VSgRNTfZ7hlGFyF8cOY3edw
```

#### readOnly

```bash
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9uIjoicmVhZE9ubHkiLCJpYXQiOjE3MzAyNDA0MjYsImV4cCI6MTczMjgzMjQyNn0.h7xe_OvjwxxxelwVVcZjXK2lMfHjp6eFXR9sP0Kl35xHmC78aESBEJnnogBoMJzGgVE_BJRpjh6YJl7dKhyEXJDuYoYVk7V-N6DqfwQ9DxyWWcPOPg1-MOmfFxJvmPv2CtMzgDw3KIZsrQbTvC5ZUuBgfoKKufAVozpKnHgjDWBetWhi1j51qgKrt6ZReBw4AF5uqsdkfRH5EEEplehTemsq85M67fBe-mYi0htU2qEpbC3Pg1klA8ALg2vfnp_Q9USRM8IXoIoyG2BrnbFoTeMv0Pdl3J-flKjkolh0W_SiCvUE91CcGjTTs06UaxbW-BFVZzBTuvhR_XJchjGE8Q
```

## Development

Run the following command to run MongoDB in a Docker container:

```bash
docker-compose -p products-api -f docker-compose.mongo.yml up --build
```

After that you can run the following command to start the `development` environment:

```bash
# Init env file
cp .env.example .env

# Install dependencies
npm install

# Run development env
npm run start
```

## Run tests

```bash
# all tests
npm run test

# unit tests
npm run test:unit

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Generate data

From docker:

```bash
docker exec -it nestjs npm run seed:products
```

From local:

```bash
# Install dependencies
npm install

# Seed data
npm run seed:products
```

## Compile and run the project

```bash
# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

The API Documentation is generated with **@nestjs/swagger** for easy API reference and testing.

Access the API docs at:

```
http://localhost:3001/api/docs
```

### Permissions

- **readWrite**: Grants both read and write access to resources.
- **readOnly**: Grants only read access to resources.

### Usage

To use the tokens, include them in the `Authorization` header of your requests as follows:

```http
Authorization: Bearer <TOKEN>
```

### Private and Public keys

Private and public keys are stored in the .env file as JWT_PRIVATE_KEY and JWT_PUBLIC_KEY

To generate these keys, you can use the following commands:

```bash
openssl genpkey -algorithm RSA -out private.key
openssl rsa -pubout -in private.key -out public.key
```

## Deployment

```bash
npm install -g mau
mau deploy
```
