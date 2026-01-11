import { render, screen } from '@testing-library/react';
import { CheckoutButtonUi } from './checkout-button-ui';
import { formatName, formatPhoneNumber } from '@/lib/i18n-utils';
import React from 'react';

describe('Checkout Initiation & I18n', () => {
  it('renders checkout button with total price', () => {
    render(<CheckoutButtonUi total={1500} />);
    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
    expect(screen.getByText('₹1,500')).toBeInTheDocument();
  });

  it('formats names correctly (title case)', () => {
    expect(formatName('john doe')).toBe('John Doe');
    expect(formatName('SUDHA REDDY')).toBe('Sudha Reddy');
  });

  it('formats phone numbers for INR locale', () => {
    // Basic validation for Indian format
    expect(formatPhoneNumber('9999999999')).toBe('+91 99999 99999');
  });
});
