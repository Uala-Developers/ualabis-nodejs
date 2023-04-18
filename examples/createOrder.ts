import UalaApiCheckout from '../index';

const run = async () => {
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

  return [order, generatedOrder];
};

run();
