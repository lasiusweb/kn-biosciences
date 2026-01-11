import { render, screen } from '@testing-library/react';
import { ProductPricing } from './product-pricing';

describe('ProductPricing Component', () => {
  it('renders standard price correctly', () => {
    render(<ProductPricing basePrice={1000} />);
    expect(screen.getByText('₹1,000')).toBeInTheDocument();
  });

  it('renders range-based pricing correctly', () => {
    const ranges = [
      { min: 1, max: 10, price: 1000 },
      { min: 11, max: 50, price: 900 },
      { min: 51, price: 800 },
    ];
    render(<ProductPricing basePrice={1000} ranges={ranges} currentQuantity={20} />);
    // Should show the discounted price for 20 items (900)
    expect(screen.getByText('₹900')).toBeInTheDocument();
    expect(screen.getByText('₹1,000')).toHaveClass('line-through');
  });

  it('renders subscription options correctly', () => {
    const subscriptions = [
      { duration: 'monthly', price: 900 },
      { duration: 'yearly', price: 8000 },
    ];
    render(<ProductPricing basePrice={1000} subscriptions={subscriptions} selectedSubscription="monthly" />);
    expect(screen.getByText('₹900')).toBeInTheDocument();
    expect(screen.getByText('/ month')).toBeInTheDocument();
  });
});
