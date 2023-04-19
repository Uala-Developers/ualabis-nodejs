# Ualá API Checkout JavaScript SDK

Official Javascript SDK for Ualá Bis API Checkout

SDK Javascript oficial de Ualá Bis API Checkout

<img align="right" src="https://nodejs.org/static/images/logo.svg" width="250"/>


## Content
  - [Installation](#installation) | [Instalación](#instalación)
  - [Functions](#functions) | [Funciones](#funciones)
  - [Usage](#usage) | [Uso](#uso)
  - [API Checkout Docs](#api-checkout-docs)

## Installation
Install the package with:
```sh
npm i ualabis-nodejs
```

## Functions
List of all functions:
  - setUp
  - createOrder
  - getOrder
  - getFailedNotifications
  - getOrders

## Usage
The package needs to be configured with your account's secret key

```js
/**
 * if you use ES Modules instead of CommonJS use import statement
 * import UalaApiCheckout from 'ualabis-nodejs';
*/

const UalaApiCheckout = require('ualabis-nodejs');

await UalaApiCheckout.setUp({
  userName: 'example_user',
  clientId: 'example_client_id',
  clientSecret: 'example_client_secret',
  isDev: true,
});

const order = await UalaApiCheckout.createOrder({
  amount: 10.2,
  description: 'test',
  callbackSuccess: 'https://www.google.com/search?q=failed',
  callbackFail: 'https://www.google.com/search?q=success',
});

const generatedOrder = await UalaApiCheckout.getOrder(order.uuid);

const orders = await UalaApiCheckout.getOrders({limit:'2', fromDate:'2022-08-04', toDate:'2022-08-09'});

```


# Español

## Instalación
Instale el paquete con el siguiente comando:
```sh
npm i ualabis-nodejs
```

## Funciones
Listado de todas las funciones:
  - setUp
  - createOrder
  - getOrder
  - getFailedNotifications
  - getOrders

## Uso
Para hacer uso del SDK es necesario que configure sus credenciales como se muestra a continuación:

```js
/**
 * Si su código usa ES Modules y no CommonJS, importa el
 * paquete de la siguiente manera:
 * import UalaApiCheckout from 'ualabis-nodejs';
*/

const UalaApiCheckout = require('ualabis-nodejs');

await UalaApiCheckout.setUp({
  userName: 'example_user',
  clientId: 'example_client_id',
  clientSecret: 'example_client_secret',
  isDev: true,
});

const order = await UalaApiCheckout.createOrder({
  amount: 10.2,
  description: 'test',
  callbackSuccess: 'https://www.google.com/search?q=failed',
  callbackFail: 'https://www.google.com/search?q=success',
});

const generatedOrder = await UalaApiCheckout.getOrder(order.uuid);

const orders = await UalaApiCheckout.getOrders({limit:'2', fromDate:'2022-08-04', toDate:'2022-08-09'});

```

## API Checkout Docs
Also you can show Api Checkout Documentation in https://developers.ualabis.com.ar