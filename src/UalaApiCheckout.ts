import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../types/errors';

import Notifications from '../types/notifications';
import {
  NewOrder,
  NewOrderParams,
  OrderData,
  OrderSearchParams,
} from '../types/order';
import { SetUpTypes } from '../types/setUp';
import Error from './error';

const apiBaseUrls = {
  stage: 'https://checkout.stage.ua.la/1',
  production: 'https://checkout.prod.ua.la/1',
};

const authApiBaseUrls = {
  stage: 'https://auth.stage.ua.la/1/auth',
  production: 'https://auth.prod.ua.la/1/auth',
};

const config: any = {};

const createToken = async (): Promise<void> => {
  try {
    const { data } = await axios.post(
      '/token',
      {
        user_name: config.userName,
        client_id: config.clientId,
        client_secret_id: config.clientSecret,
        grant_type: 'client_credentials',
      },
      {
        baseURL: config.authBaseUrl,
      },
    );
    config.authToken = data.access_token;
    config.authTokenExpirationTime = new Date().getTime() + data.expires_in * 1000;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { code, message } = error.response.data as ErrorResponse;
      throw new Error(message, code, error.response.status);
    }
    /* istanbul ignore next */
    throw new Error('Create token error', '666');
  }
};

const validateToken = async () => {
  if (new Date().getTime() >= config.authTokenExpirationTime) {
    await createToken();
  }
};

/**
 * Config with your params to auth
 * @param setUpConfig the params to auth
 */
const setUp = async (setUpConfig: SetUpTypes) => {
  config.userName = setUpConfig.userName;
  config.clientId = setUpConfig.clientId;
  config.clientSecret = setUpConfig.clientSecret;
  config.baseUrl = setUpConfig.isDev
    ? apiBaseUrls.stage
    : apiBaseUrls.production;
  config.authBaseUrl = setUpConfig.isDev
    ? authApiBaseUrls.stage
    : authApiBaseUrls.production;
  await createToken();
};

/**
 * Create an order that you can use to make a sale.
 * @description more information https://developers.ualabis.com.ar/orders/create-order/post
 * @param NewOrderParams the params to create a order
 * @example
 const order = await createOrder({
    amount: 10.2,
    description: 'your description',
    callbackSuccess: 'https://www.google.com/search?q=failed',
    callbackFail: 'https://www.google.com/search?q=success',
});
 */
const createOrder = async ({
  amount,
  description,
  callbackFail,
  callbackSuccess,
  notificationUrl,
}: NewOrderParams): Promise<NewOrder> => {
  try {
    await validateToken();
    const { data } = await axios.post(
      '/checkout',
      {
        amount: amount.toString(),
        description,
        userName: config.userName,
        callback_fail: callbackFail,
        callback_success: callbackSuccess,
        notification_url: notificationUrl,
      },
      {
        baseURL: config.baseUrl,
        headers: {
          Authorization: `Bearer ${config.authToken}`,
        },
      },
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { code, message, Message } = error.response.data as ErrorResponse;
      throw new Error(message || Message, code, error.response.status);
    }
    /* istanbul ignore next */
    throw new Error('Create order error', '666');
  }
};

/**
 * Gets a previously created order with unique identifier.
 * @param orderId the order id
 * @description more information https://developers.ualabis.com.ar/orders/get-order/get/order
 * @example
    const order = await getOrder('d5894497-7');
 * @returns the previously created order
 */
const getOrder = async (orderId: string): Promise<OrderData> => {
  try {
    await validateToken();
    const { data } = await axios.get(`/order/${orderId}`, {
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { code, message, Message } = error.response.data as ErrorResponse;
      throw new Error(message || Message, code, error.response.status);
    }
    /* istanbul ignore next */
    throw new Error('Get order error', '666');
  }
};

/**
 * Get a list of failed notifications via webhook that could not be completed with HTTP Status 200
 * @description more information https://developers.ualabis.com.ar/notifications/failed-notifications/failed
 *  * @example
    const failedNotifications = await getFailedNotifications();
 * @returns the failded notifications
 */
const getFailedNotifications = async (): Promise<Notifications> => {
  try {
    await validateToken();
    const { data } = await axios.get('/notifications', {
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { code, message, Message } = error.response.data as ErrorResponse;
      throw new Error(message || Message, code, error.response.status);
    }
    /* istanbul ignore next */
    throw new Error('Get failed notifications error', '666');
  }
};

/**
 * Get a list of orders that be created
 * @param orderSearchParameters params to search and filter orders - *not required*
 * @description more information https://developers.ualabis.com.ar/orders/get-order/gets/orders
 * @example
 * // Gets first 100 orders with creation dates between 2022-08-04 and 2022-08-09
    const orders = await getOrders({limit:'1', fromDate:'2022-08-04', toDate:'2022-08-09'});
 * @returns the orders
 */
const getOrders = async (orderSearchParameters?: OrderSearchParams): Promise<OrderData[]> => {
  try {
    await validateToken();
    const { data } = await axios.get('/order', {
      baseURL: config.baseUrl,
      params: orderSearchParameters,
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { code, message, Message } = error.response.data as ErrorResponse;
      throw new Error(message || Message, code, error.response.status);
    }
    /* istanbul ignore next */
    throw new Error('Get orders error', '666');
  }
};

export = {
  setUp,
  createOrder,
  getOrder,
  getFailedNotifications,
  getOrders,
};
