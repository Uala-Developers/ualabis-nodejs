import { expect, test } from '@jest/globals';
import { advanceTo, clear } from 'jest-date-mock';
import UalaApiCheckout from '../index';
import {
  createTokenMock, createTokenProdMock, createOrderMock, getOrderMock, getFailedNotificationsMock, getOrdersMock,
} from './mocks/apiCheckoutRequest';

test('setUp success', async () => {
  createTokenMock();
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
});

test('setUp success - default isDev value', async () => {
  createTokenProdMock();
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
  });
});

test('create order', async () => {
  createTokenMock();
  const fakeOrder = createOrderMock();
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  const newOrder = await UalaApiCheckout.createOrder({
    amount: 10.2,
    description: 'test',
    callbackSuccess: 'https://www.google.com/search?q=failed',
    callbackFail: 'https://www.google.com/search?q=success',
  });
  expect(JSON.stringify(newOrder)).toBe(JSON.stringify(fakeOrder));
});

test('create order - refresh expired token', async () => {
  createTokenMock();
  createTokenMock();
  const now = new Date();
  const date = new Date();
  date.setDate(date.getDate() - 1);
  advanceTo(date);

  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });

  advanceTo(now.getTime() + 1000);
  const fakeOrder = createOrderMock();
  const newOrder = await UalaApiCheckout.createOrder({
    amount: 10.2,
    description: 'test',
    callbackSuccess: 'https://www.google.com/search?q=failed',
    callbackFail: 'https://www.google.com/search?q=success',
  });
  expect(JSON.stringify(newOrder)).toBe(JSON.stringify(fakeOrder));
  clear();
});

test('get order', async () => {
  createTokenMock();
  const fakeOrder = getOrderMock();
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  const order = await UalaApiCheckout.getOrder('6447fc99-d2da-44b8-b041-4178ebb2898a');

  expect(JSON.stringify(order)).toBe(JSON.stringify(fakeOrder));
});

test('get failed notifications', async () => {
  createTokenMock();
  const fakeFailedNotifications = getFailedNotificationsMock();
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  const failedNotifications = await UalaApiCheckout.getFailedNotifications();
  expect(failedNotifications.notifications.length).toBe(fakeFailedNotifications.notifications.length);
  expect(failedNotifications.notifications[0].uuid).toBe(fakeFailedNotifications.notifications[0].uuid);
});

test('get orders', async () => {
  createTokenMock();
  const fakeOrders = getOrdersMock();
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  const orders = await UalaApiCheckout.getOrders({limit: '1'});
  expect(JSON.stringify(orders)).toBe(JSON.stringify(fakeOrders));

});

test('ERROR on create access token - User account not found', async () => {
  createTokenMock(401, {
    code: '3003',
    message: 'User account not found',
  });
  try {
    await UalaApiCheckout.setUp({
      userName: 'user-test',
      clientId: 'client-test',
      clientSecret: 'client-secret-test',
      isDev: true,
    });
  } catch (error: any) {
    expect(error.message).toBe('User account not found');
    expect(error.type).toBe('user_no_exist');
  }
});

test('ERROR on create access token - Internal api error', async () => {
  createTokenMock(500, {
    message: 'Something bad happened. Please try again.',
  });
  try {
    await UalaApiCheckout.setUp({
      userName: 'user-test',
      clientId: 'client-test',
      clientSecret: 'client-secret-test',
      isDev: true,
    });
  } catch (error: any) {
    expect(error.message).toBe('Something bad happened. Please try again.');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on create order', async () => {
  createTokenMock();
  createOrderMock(500, {
    message: 'Something bad happened. Please try again.',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });

  try {
    await UalaApiCheckout.createOrder({
      amount: 10.2,
      description: 'test',
      callbackFail: 'https://www.google.com/search?q=failed',
      callbackSuccess: 'https://www.google.com/search?q=success',
    });
  } catch (error: any) {
    expect(error.message).toBe('Something bad happened. Please try again.');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on create order - Expired Token', async () => {
  createTokenMock();
  createOrderMock(403, {
    Message: 'User is not authorized to access this resource with an explicit deny',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });

  try {
    await UalaApiCheckout.createOrder({
      amount: 10.2,
      description: 'test',
      callbackFail: 'https://www.google.com/search?q=failed',
      callbackSuccess: 'https://www.google.com/search?q=success',
    });
  } catch (error: any) {
    expect(error.message).toBe('User is not authorized to access this resource with an explicit deny');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on get order', async () => {
  createTokenMock();
  getOrderMock(500, {
    code: '2004',
    message: 'unexpected error occurred. Please try again',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  try {
    await UalaApiCheckout.getOrder('6447fc99-d2da-44b8-b041-4178ebb2898a');
  } catch (error: any) {
    expect(error.message).toBe('unexpected error occurred. Please try again');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on get order - Expired Token', async () => {
  createTokenMock();
  getOrderMock(403, {
    Message: 'User is not authorized to access this resource with an explicit deny',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  try {
    await UalaApiCheckout.getOrder('6447fc99-d2da-44b8-b041-4178ebb2898a');
  } catch (error: any) {
    expect(error.message).toBe('User is not authorized to access this resource with an explicit deny');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on get failed notifications', async () => {
  createTokenMock();
  getFailedNotificationsMock(500, {
    message: 'Something bad happened. Please try again.',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  try {
    await UalaApiCheckout.getFailedNotifications();
  } catch (error: any) {
    expect(error.message).toBe('Something bad happened. Please try again.');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on get failed notifications - Expired Token', async () => {
  createTokenMock();
  getFailedNotificationsMock(403, {
    Message: 'User is not authorized to access this resource with an explicit deny',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  try {
    await UalaApiCheckout.getFailedNotifications();
  } catch (error: any) {
    expect(error.message).toBe('User is not authorized to access this resource with an explicit deny');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on get orders', async () => {
  createTokenMock();
  getOrdersMock(500, {
    code: '999',
    message: 'unexpected error occurred. Please try again',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  try {
    await UalaApiCheckout.getOrders({limit: '1'});
  } catch (error: any) {
    expect(error.message).toBe('unexpected error occurred. Please try again');
    expect(error.type).toBe('api_error');
  }
});

test('ERROR on get orders - Expired Token', async () => {
  createTokenMock();
  getOrdersMock(403, {
    Message: 'User is not authorized to access this resource with an explicit deny',
  });
  await UalaApiCheckout.setUp({
    userName: 'user-test',
    clientId: 'client-test',
    clientSecret: 'client-secret-test',
    isDev: true,
  });
  try {
    await UalaApiCheckout.getOrders({limit: '1'});
  } catch (error: any) {
    expect(error.message).toBe('User is not authorized to access this resource with an explicit deny');
    expect(error.type).toBe('api_error');
  }
});