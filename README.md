# 💳 Valex

## 🗒️ Contents

- [💳 Valex](#-valex)
  - [🗒️ Contents](#️-contents)
  - [📌 Description](#-description)
  - [🚧 Status](#-status)
  - [🧰 Built With](#-built-with)
  - [🧭 API Reference](#-api-reference)
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
  - [⚙️ How to Run](#️-how-to-run)
    - [Running Locally](#running-locally)

## 📌 Description

Valex is a **voucher card** API responsible for creating, reloading, activating, as well as processing purchases.

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

### Running Locally