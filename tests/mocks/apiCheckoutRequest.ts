import nock from 'nock';
import { ErrorResponse } from '../../types/errors';

const createTokenMock = (statusCode: any = 200, response: ErrorResponse | any = {
  access_token: 'fake_access_token',
  expires_in: 86400,
  token_type: 'Bearer',
}) => {
  nock('https://auth.stage.ua.la/1/auth').post('/token').reply(statusCode, response);
};

const createTokenProdMock = (statusCode: any = 200, response: ErrorResponse | any = {
  access_token: 'fake_access_token',
  expires_in: 86400,
  token_type: 'Bearer',
}) => {
  nock('https://auth.prod.ua.la/1/auth').post('/token').reply(statusCode, response);
};

const fakeCreateOrderResponse = {
  id: '/api/v2/orders/6447fc99-d2da-44b8-b041-4178ebb2898a',
  type: 'Order',
  uuid: '6447fc99-d2da-44b8-b041-4178ebb2898a',
  orderNumber: '0004116-00000054772',
  currency: '032',
  amount: '10.2',
  status: 'PENDING',
  refNumber: '7c8cf59e-6fdb-4e65-94ce-e56cc023e05c',
  links: {
    checkoutLink:
      'https://checkout-uala.preprod.geopagos.com/orders/6447fc99-d2da-44b8-b041-4178ebb2898a',
    success: 'https://www.google.com/search?q=success',
    failed: 'https://www.google.com/search?q=failed',
  },
};
const createOrderMock = (statusCode = 200, response: ErrorResponse | any = fakeCreateOrderResponse) => {
  nock('https://checkout.stage.ua.la/1', {
    reqheaders: {
      authorization: 'Bearer fake_access_token',
    },
  })
    .post('/checkout')
    .reply(statusCode, response);
  return response;
};

const fakeGetNotificationsResponse = {
  notifications: [
    {
      uuid: '6447fc99-d2da-44b8-b041-4178ebb2898a',
      account_id: 'test-id',
      status_code: 403,
      attempts: 1,
      amount: 10.2,
      created_date: '2022-07-26T21:58:52Z',
    },
  ],
};
const getFailedNotificationsMock = (statusCode = 200, response: any = fakeGetNotificationsResponse) => {
  nock('https://checkout.stage.ua.la/1', {
    reqheaders: {
      authorization: 'Bearer fake_access_token',
    },
  })
    .get('/notifications')
    .reply(statusCode, response);
  return response;
};

const fakeGetOrderResponse = {
  order_id: '6447fc99-d2da-44b8-b041-4178ebb2898a',
  status: 'PENDING',
  ref_number: '7c8cf59e-6fdb-4e65-94ce-e56cc023e05f',
  amount: 10.2,
};
const getOrderMock = (statusCode = 200, response: any = fakeGetOrderResponse) => {
  nock('https://checkout.stage.ua.la/1', {
    reqheaders: {
      authorization: 'Bearer fake_access_token',
    },
  })
    .get('/order/6447fc99-d2da-44b8-b041-4178ebb2898a')
    .reply(statusCode, response);
  return response;
};

export {
  createTokenMock, createTokenProdMock, createOrderMock, getFailedNotificationsMock, getOrderMock,
};
