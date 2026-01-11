import { render, screen, fireEvent } from '@testing-library/react';
import { ProductAddToCart } from './product-add-to-cart';

describe('ProductAddToCart Component', () => {
  const defaultProps = {
    productId: 'test-123',
    stock: 10,
    min: 1,
    max: 5,
    increment: 1,
    onAdd: jest.fn(),
  };

  it('renders quantity input and add button', () => {
    render(<ProductAddToCart {...defaultProps} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('validates quantity rules (min/max)', () => {
    render(<ProductAddToCart {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    const button = screen.getByRole('button', { name: /add to cart/i });

    // Test min
    fireEvent.change(input, { target: { value: '0' } });
    expect(button).toBeDisabled();

    // Test max
    fireEvent.change(input, { target: { value: '6' } });
    expect(button).toBeDisabled();

    // Test valid
    fireEvent.change(input, { target: { value: '3' } });
    expect(button).not.toBeDisabled();
  });

  it('disables button when out of stock', () => {
    render(<ProductAddToCart {...defaultProps} stock={0} />);
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
  });

  it('dispatches add event with correct quantity', () => {
    render(<ProductAddToCart {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    const button = screen.getByRole('button', { name: /add to cart/i });

    fireEvent.change(input, { target: { value: '4' } });
    fireEvent.click(button);

    expect(defaultProps.onAdd).toHaveBeenCalledWith('test-123', 4);
  });
});
