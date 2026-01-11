export class CommerceError extends Error {
  code: string;

  constructor(code: string, message?: string) {
    super(message);
    this.name = 'CommerceError';
    this.code = code;
  }
}

export const ERROR_MESSAGES: Record<string, string> = {
  OUT_OF_STOCK: 'This product is currently out of stock.',
  INVALID_QUANTITY: 'The selected quantity is invalid.',
  CART_LIMIT_EXCEEDED: 'You have reached the maximum quantity for this item.',
  PAYMENT_FAILED: 'Payment could not be processed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof CommerceError) {
    return ERROR_MESSAGES[error.code] || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}
