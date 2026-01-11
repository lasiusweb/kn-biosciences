import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from './cart-context';
import React from 'react';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      upsert: jest.fn(() => Promise.resolve({ error: null })),
      delete: jest.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

const TestComponent = () => {
  const { items, addItem, removeItem, updateQuantity, totalItems } = useCart();
  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <button onClick={() => addItem({ id: 'p1', name: 'Product 1', price: 100, quantity: 1 })}>Add Item</button>
      <div data-testid="items-count">{items.length}</div>
      {items.map(item => (
        <div key={item.id}>
          <span data-testid={`item-qty-${item.id}`}>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>Update Qty</button>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('adds an item to the cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add Item');
    await act(async () => {
      addButton.click();
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
  });

  it('updates item quantity', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      screen.getByText('Add Item').click();
    });

    const updateButton = screen.getByText('Update Qty');
    await act(async () => {
      updateButton.click();
    });

    expect(screen.getByTestId('item-qty-p1')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
  });

  it('removes an item', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      screen.getByText('Add Item').click();
    });

    const removeButton = screen.getByText('Remove');
    await act(async () => {
      removeButton.click();
    });

    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });
});
