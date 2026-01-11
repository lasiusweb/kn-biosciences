import { render, screen, fireEvent } from '@testing-library/react';
import { CartItemsUi } from './cart-items-ui';
import { CartProvider, useCart } from '@/lib/cart-context';
import React, { useEffect } from 'react';

const TestWrapper = ({ items }: { items: any[] }) => {
  const { addItem, clearCart } = useCart();
  useEffect(() => {
    clearCart();
    items.forEach(item => addItem(item));
  }, []);

  return <CartItemsUi />;
};

describe('CartItemsUi Component', () => {
  const mockItems = [
    { id: 'p1', name: 'Product 1', price: 100, quantity: 2 },
  ];

  it('renders a list of cart items', () => {
    render(
      <CartProvider>
        <TestWrapper items={mockItems} />
      </CartProvider>
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('₹200')).toBeInTheDocument();
  });

  it('allows quantity updates and removal', () => {
    render(
      <CartProvider>
        <TestWrapper items={mockItems} />
      </CartProvider>
    );
    
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    
    // Test removal
    const removeButton = screen.getByRole('button', { name: /remove item/i });
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });
});