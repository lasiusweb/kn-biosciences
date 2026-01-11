import { render, screen, fireEvent, act } from '@testing-library/react';
import { CheckoutPaymentByExpress } from './checkout-payment-by-express';
import React from 'react';

describe('Express Payment Integration', () => {
  it('renders express payment button', () => {
    render(<CheckoutPaymentByExpress total={1000} />);
    expect(screen.getByRole('button', { name: /Pay Express/i })).toBeInTheDocument();
  });

  it('initiates payment flow on click', async () => {
    const handlePayment = jest.fn(() => Promise.resolve());
    render(<CheckoutPaymentByExpress total={1000} onInitiate={handlePayment} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Pay Express/i }));
    });
    expect(handlePayment).toHaveBeenCalled();
  });
});
