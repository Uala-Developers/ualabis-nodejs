import { ErrorCodes, ErrorTypes } from '../types/errors';

const errorsCode = {
  666: 'unknown',
  999: 'api_error',
  1000: 'input_validation',
  1001: 'required_field_empty',
  1002: 'invalid_credentials',
  1003: 'invalid_amount',
  1004: 'user_no_exist',
  1005: 'no_owner_order',
  1006: 'no_record_found',
  2004: 'api_error',
  2005: 'no_owner_order',
  3001: 'required_field_empty',
  3003: 'user_no_exist',
  3005: 'invalid_client_id',
  3006: 'invalid_client_secret',
};

class UalaError extends Error {
  readonly message: string;

  readonly type: ErrorTypes;

  readonly statusCode: number | undefined;

  // eslint-disable-next-line default-param-last
  constructor(erroMessage: string = 'Error', errorCode: ErrorCodes = '999', statusCode?: number) {
    super(erroMessage);
    this.message = erroMessage;
    this.type = errorsCode[errorCode] as ErrorTypes;
    this.statusCode = statusCode;
  }
}

export default UalaError;
