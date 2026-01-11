import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from './page';
import { CartProvider } from '@/lib/cart-context';

describe('Checkout Page', () => {
  it('renders without crashing', () => {
    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );
    expect(screen.getByText(/Shipping Details/i)).toBeInTheDocument();
  });

  it('displays grand total', () => {
    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );
    expect(screen.getByText(/Grand Total/i)).toBeInTheDocument();
  });
});
