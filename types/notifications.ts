/**
 * The failded notification of the webhook
 */
type Notifications = {
  notifications: [
    {
      /** uuid of the order */
      uuid: string;
      /** account id owner of the order */
      account_id: string;
      /** HTTP status code received */
      status_code: 400 | 401 | 403 | 500;
      /** number of notification attempts */
      attempts: number;
      /** order amount */
      amount: number;
      /** created date of failed notification */
      created_date: string;
    }
  ];
}

export default Notifications;
