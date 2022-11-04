# 💳 Valex

## 📌 Description

Valex is a **voucher card** API responsible for creating, reloading, activating, as well as processing purchases.

## 🗒️ Contents

- [💳 Valex](#-valex)
  - [📌 Description](#-description)
  - [🗒️ Contents](#️-contents)
  - [🚧 Status](#-status)
  - [🧰 Built With](#-built-with)
  - [🧭 API Reference](#-api-reference)
  
      <details> <summary>Endpoints</summary>
    
      - [CARDS](#cards)
        - [Create Card](#create-card)
          - [Request](#request)
          - [Response](#response)
        - [Activate Card](#activate-card)
          - [Request](#request-1)
          - [Response](#response-1)
        - [Block Card](#block-card)
          - [Request](#request-2)
          - [Response](#response-2)
        - [Unblock Card](#unblock-card)
          - [Request](#request-3)
          - [Response](#response-3)
        - [Recharge Card](#recharge-card)
          - [Request](#request-4)
          - [Response](#response-4)
        - [Get Card Statement](#get-card-statement)
          - [Response](#response-5)
      - [PAYMENTS](#payments)
        - [POS Payment](#pos-payment)
          - [Request](#request-5)
          - [Response](#response-6)
      </details>
  - [⚙️ How to Run](#️-how-to-run)
    - [Cloning the Application](#cloning-the-application)
    - [Environment Variables](#environment-variables)
    - [Running Locally](#running-locally)
    - [Running on Docker](#running-on-docker)
  - [🔍 Testing the Application](#-testing-the-application)
    - [Locally](#locally)
    - [Docker](#docker)

## 🚧 Status

![status-ongoing](https://img.shields.io/badge/status-ongoing-yellow?style=for-the-badge)

## 🧰 Built With

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## 🧭 API Reference

### CARDS

#### Create Card

- Companies can create a voucher card for their employee;
- The company is authenticated using their **apikey**;

```http
POST /cards
```

##### Request

| Headers             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `x-api-key`          | `string` |  must be a valid apikey|

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `type`          | `string` |  "education", "health", "groceries", "transport", "restaurants"|
| `employeeId`          | `number` | must be an integer |

```json
{
  "type": "education",
  "employeeId": 1
}
```

##### Response

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `json`           |   `201`    | **Created**          |
| `json`           |   `409`    | **Conflict**, user already has a card with the chosen type |
| `json`           |   `400`    | **Bad Request**, request body is invalid |
| `json`           |   `404`    | **Not Found**, company or employee not found |

```json
{
  "id": 1,
  "cardholderName": "USER A NAME",
  "expirationDate": "11/27",
  "number": "9832 0653 1213 3591",
  "securityCode": "118",
  "type": "education"
}
```

#### Activate Card

- Employees can activate their voucher card by setting a password;
- The **card id** is passed as a param;
- The card cannot be expired;
- The card must not be already active;

```http
PATCH /cards/:id/activate
```

##### Request

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | must only contain four numbers |
| `securityCode`   | `string` | must only contain three numbers |

```json
{
  "password": "1234",
  "securityCode": "118"
}
```

##### Response

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `empty`          |   `200`    | **OK**          |
| `json`           |   `400`    | **Bad Request**, request body is invalid |
| `json`           |   `401`    | **Unauthorized**, wrong security code |
| `json`           |   `404`    | **Not Found**, card not found |
| `json`           |   `422`    | **Unprocessable Entity**, the card is expired or the card is already active |

#### Block Card

- Employees can block their cards;
- The **card id** is passed as a param;
- The card cannot be expired;
- The card must be active and cannot be already blocked;

```http
PATCH /cards/:id/block
```

##### Request

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | must only contain four numbers |

```json
{
  "password": "1234"
}
```

##### Response

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `empty`          |   `200`    | **OK**          |
| `json`           |   `400`    | **Bad Request**, request body is invalid |
| `json`           |   `401`    | **Unauthorized**, wrong password |
| `json`           |   `404`    | **Not Found**, card not found |
| `json`           |   `422`    | **Unprocessable Entity**, the card is expired or the card is not active or the card is already blocked |

#### Unblock Card

- Employees can unblock their cards;
- The **card id** is passed as a param;
- The card cannot be expired;
- The card must be active and cannot be already unblocked;

```http
PATCH /cards/:id/unblock
```

##### Request

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | must only contain four numbers |

```json
{
  "password": "1234"
}
```

##### Response

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `empty`          |   `200`    | **OK**          |
| `json`           |   `400`    | **Bad Request**, request body is invalid |
| `json`           |   `401`    | **Unauthorized**, wrong password |
| `json`           |   `404`    | **Not Found**, card not found |
| `json`           |   `422`    | **Unprocessable Entity**, the card is expired or the card is not active or the card is already unblocked |

#### Recharge Card

- Companies can recharge their employee's cards;
- The **card id** is passed as a param;
- The company is authenticated using their **apikey**;
- The card cannot be expired or blocked;
- The card must be active;

```http
POST /cards/:id/recharge
```

##### Request

| Headers             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `x-api-key`          | `string` |  must be a valid apikey|

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `amount`       | `number` | must be an integer greater than zero |

```json
{
  "amount": 1000
}
```

##### Response

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `json`           |   `201`    | **Created**          |
| `json`           |   `400`    | **Bad Request**, request body is invalid |
| `json`           |   `404`    | **Not Found**, card not found or company not found |
| `json`           |   `422`    | **Unprocessable Entity**, the card is expired or the card is not active or the card is blocked |

```json
{
  "id": 1,
  "amount": 1000,
  "cardId": 1,
  "timestamp": "03/11/2022"
}
```

#### Get Card Statement

- The employee can get the card statement (balance, recharges and payments);
- The **card id** is passed as a param;

```http
GET /cards/:id/statement
```

##### Response

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `json`           |   `200`    | **OK**          |
| `json`           |   `404`    | **Not Found**, card not found  |

```json
{
  "balance": 100,
  "recharges": [
    {
      "id": 1,
      "amount": 1000,
      "cardId": 1,
      "timestamp": "03/11/2022"
    }
  ],
  "payments": [
    {
      "id": 1,
      "amount": 900,
      "cardId": 1,
      "business": {
        "id": 1,
        "name": "Hewlett Packard Enterprise - Reichel Group",
        "type": "education"
      },
      "timestamp": "03/11/2022"
    }
  ]
}
```

### PAYMENTS

#### POS Payment

- Employees can buy on POS using their voucher card;
- The POS business type must be the same as the voucher card type;
- The card must be active and cannot be blocked or expired;
- The card must have sufficient balance;

```http
POST /payments/pos
```

##### Request

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `cardId`       | `number` | must be an integer |
| `password`       | `string` | must only contain four numbers |
| `businessId`       | `number` | must be an integer |
| `amount`       | `number` | must be an integer greater than zero |

```json
{
  "cardId": 1,
  "password": "1234",
  "businessId": 1,
  "amount": 900
}
```

##### Response

| Body             |  Code      |  Description                        |
| :--------------- | :-------   | :--------------------------------- |
| `json`           |   `201`    | **Created**          |
| `json`           |   `400`    | **Bad Request**, request body is invalid |
| `json`           |   `401`    | **Unauthorized**, wrong password |
| `json`           |   `404`    | **Not Found**, card not found or business not found |
| `json`           |   `422`    | **Unprocessable Entity**, the card is expired or the card is not active or the card is blocked, insufficient balance |

## ⚙️ How to Run

### Cloning the Application

1. Clone the application to your machine:

   ```bash
   git clone https://github.com/akiraTatesawa/valex.git
   ```

2. Navigate to the application dir:

    ```bash
    cd valex/
    ```

3. Install the dependencies:

    ```bash
    npm i
    ```

### Environment Variables

1. Set up a **.env.development** file on the root of the project following the example on **.env.example**:
   - `PORT`: The port where the node app is going to run;
   - `POSTGRES_USERNAME`: Your postgres username;
   - `POSTGRES_PASSWORD`: Your postgres password;
   - `POSTGRES_HOST`: Your postgres host;
   - `POSTGRES_PORT`: The port where postgres is running;
   - `POSTGRES_DATABASE`: The name of the database;
   - `DATABASE_URL`: The URL of the postgres database;
   - `CRYPTR_SECRET`: The secret key used for encrypting data;

2. The postgres related variables are going to change depending on whether you are going to run the app locally or on docker;

### Running Locally

1. Run the prisma migration command:

    ```bash
    npm run dev:migrate
    ```

2. Run the prisma db seed command:

    ```bash
    npm run dev:seed
    ```

3. Run the application and have fun!

    ```bash
    npm run dev
    ```

### Running on Docker

1. Run the postgres command:

    ```bash
    npm run dev:postgres
    ```

2. Run the node app docker command:

    ```bash
    npm run dev:docker
    ```

3. On another terminal, run the seed command:

    ```bash
    npm run dev:docker:seed
    ```

4. Have fun!

## 🔍 Testing the Application

### Locally

1. Set up a **.env.test** file following the **.env.example** model;
2. Run the testing command:

    ```bash
    npm run test
    ```

### Docker

1. Set up a **.env.test** file following the **.env.example** model;
2. If you are running the dev application, drop it with the following command:

    ```bash
    npm run dev:docker:down
    ```

3. Create the postgres testing container:

    ```bash
    npm run test:postgres
    ```

4. Run the docker testing command:

    ```bash
    npm run test:docker
    ```

5. After the test, drop the testing containers:

    ```bash
    npm run test:docker:down
    ```
