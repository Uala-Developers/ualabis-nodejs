/**
 * The order data to create new order
 */
type NewOrderParams = {
  /** amount to collect */
  amount: number,
  /** order desciption */
  description: string,
  /** redirect link on fail */
  callbackFail: string,
  /** redirect link on success */
  callbackSuccess: string,
  /** webhook link to notificate order change */
  notificationUrl?: string
}

/**
 * The order data received on getOrder
 */
type OrderData = {
  /** order id */
  order_id: string;
  /** order status */
  status: 'APPROVED' | 'PENDING' | 'PROCESSED' | 'REJECTED';
  /** order reference number */
  ref_number: string;
  /** order amount */
  amount: number;
}

/**
 * The new order data received on createOrder
 */
type NewOrder = {
  /** order id */
  id: string;
  /** operation type */
  type: string;
  /** uuid of the order */
  uuid: string;
  /** order number */
  orderNumber: string;
  /** order currency */
  currency: string;
  /** order amount */
  amount: string;
  /** order status */
  status: 'PENDING';
  /** order reference number */
  refNumber: string;
  links: {
    /** payment link */
    checkoutLink: string;
    /** redirect link if is success the payment */
    success: string;
    /** redirect link if is failed the payment */
    failed: string;
  };
}

export { OrderData, NewOrder, NewOrderParams };
