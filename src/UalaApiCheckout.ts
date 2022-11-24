import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../types/errors';

import Notifications from '../types/notifications';
import { NewOrder, NewOrderParams, OrderData } from '../types/order';
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
    config.authTokenExpirationTime = new Date().getTime() + (data.expires_in * 1000);
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
  config.baseUrl = setUpConfig.isDev ? apiBaseUrls.stage : apiBaseUrls.production;
  config.authBaseUrl = setUpConfig.isDev ? authApiBaseUrls.stage : authApiBaseUrls.production;
  await createToken();
};

/**
 * Create an order that you can use to make a sale.
 * @param NewOrderParams the params to create a order
 */
const createOrder = async (
  {
    amount, description, callbackFail, callbackSuccess, notificationUrl,
  }: NewOrderParams,
): Promise<NewOrder> => {
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

export = {
  setUp,
  createOrder,
  getOrder,
  getFailedNotifications,
};
