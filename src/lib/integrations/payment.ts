// src/lib/integrations/payment.ts

type PaymentGatewayConfig = {
  key: string;
  salt: string;
  // Add other common config properties here
};

export function getPaymentConfig(gateway: 'easebuzz' | 'payu'): PaymentGatewayConfig {
  if (gateway === 'easebuzz') {
    return {
      key: process.env.NEXT_PUBLIC_EASEBUZZ_KEY || '',
      salt: process.env.NEXT_PUBLIC_EASEBUZZ_SALT || '',
    };
  } else if (gateway === 'payu') {
    return {
      key: process.env.NEXT_PUBLIC_PAYU_KEY || '',
      salt: process.env.NEXT_PUBLIC_PAYU_SALT || '',
    };
  }
  throw new Error('Unsupported payment gateway');
}

export function initEasebuzzPayment(order: any): string {
  console.log('Initializing Easebuzz payment for order:', order);
  // This will be replaced with actual Easebuzz integration logic
  return 'mock_easebuzz_url';
}

export function initPayUPayment(order: any): string {
  console.log('Initializing PayU payment for order:', order);
  // This will be replaced with actual PayU integration logic
  return 'mock_payu_url';
}
