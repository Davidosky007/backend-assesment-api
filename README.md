# RESTful API with TypeScript and MongoDB

This project is a simple RESTful API built with Node.js, TypeScript, and MongoDB as the database. It provides endpoints to create and manage products in a store.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Features
- Create, read, and manage products in a store.
- Token-based authentication for secure endpoints.
- TypeScript for enhanced code quality and maintainability.
- MongoDB for efficient data storage.


## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- MongoDB server running locally or providing a connection URI.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Davidosky007/backend-assesment-api.git
   ```
   
2. Install dependencies:

   ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
```
PORT=8080

MONGO_URI= a hosted MongoDB URL

JWT_SECRET=secret
```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Navigate to `http://localhost:8080/` to access the API.


## Endpoints

| Method | Endpoint           | Description                           | Authentication |
| ------ | ------------------ | ------------------------------------- | -------------- |
| POST   | `/api/users/register`   | Register a new user                   | No             |
| POST   | `/api/users/login`      | Login with an existing user           | No             |
| GET    | `api/products`        | Get all products                      | Yes            |
| GET    | `api/products/:id`    | Get a single product by ID            | Yes             |
| POST   | `api/products`        | Create a new product                  | Yes            |
| PUT    | `api/products/:id`    | Update an existing product by ID      | Yes            |
| DELETE | `api/products/:id`    | Delete an existing product by ID      | Yes            |

[Postman Documentation link](https://documenter.getpostman.com/view/9648616/2sA35D4iHP)


## Authentication

Some endpoints require authentication. To authenticate a request, add the `Authorization` header with the value `Bearer <token>`, where `<token>` is the access token returned from the login endpoint.


## Environment
Create a .env file in the root directory and add the following environment variables:
```bash
NODE_ENV=DEV
MONGO_URI_DEV=<A hosted mongodb database>
JWT_SECRET=<secret>
```

## Testing

To run the tests, run the following command:
```bash
npm run test
```

## Docker
To run the app in a docker container, run the following command:
```bash
docker build -t project_name.
docker run -d -p 8080:8080 project_name
```
