export type ErrorTypes =
  | 'user_no_exist'
  | 'invalid_client_id'
  | 'invalid_client_secret'
  | 'api_error'
  | 'required_field_empty'
  | 'invalid_amount'
  | 'invalid_credentials'
  | 'no_owner_order'
  | 'no_record_found'
  | 'unknown'

export type ErrorCodes =
  | '999'
  | '666'
  | '1000'
  | '1001'
  | '1002'
  | '1003'
  | '1004'
  | '1005'
  | '1006'
  | '2004'
  | '2005'
  | '3001'
  | '3003'
  | '3005'
  | '3006'

export type ErrorResponse = {
  code?: ErrorCodes,
  message?: string,
  Message?: string,
  description?: string
}
