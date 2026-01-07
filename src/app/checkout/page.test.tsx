import { render, screen, fireEvent } from '@testing-library/react';
import Page from './page'; // Assuming 'page.tsx' exports a default component

describe('Checkout Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText(/checkout/i)).toBeInTheDocument(); // Assuming "Checkout" is part of the page
  });

  it('displays payment option selection for Easebuzz and PayU', () => {
    render(<Page />);
    // These tests will fail until the UI elements are implemented
    expect(screen.getByLabelText(/easebuzz/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/payu/i)).toBeInTheDocument();
  });

  it('allows selection of a payment option', () => {
    render(<Page />);
    const easebuzzOption = screen.getByLabelText(/easebuzz/i);
    fireEvent.click(easebuzzOption);
    expect(easebuzzOption).toBeChecked();
  });

  it('displays a "Proceed to Payment" button', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: /proceed to payment/i })).toBeInTheDocument();
  });
});
