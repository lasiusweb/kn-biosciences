import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturedProducts } from './featured-products';
import { FEATURED_PRODUCTS } from '@/lib/constants';

describe('FeaturedProducts', () => {
  it('renders correctly with heading', () => {
    render(<FeaturedProducts />);
    expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();
  });

  it('renders all featured products', () => {
    render(<FeaturedProducts />);
    const displayedProducts = FEATURED_PRODUCTS.slice(0, 4);
    displayedProducts.forEach(product => {
      expect(screen.getByText(product.title)).toBeInTheDocument();
      expect(screen.getAllByText(new RegExp(product.category, 'i')).length).toBeGreaterThan(0);
      expect(screen.getByText(new RegExp(product.price.toString(), 'i'))).toBeInTheDocument();
    });
  });

  it('has links to product pages', () => {
    render(<FeaturedProducts />);
    const displayedProducts = FEATURED_PRODUCTS.slice(0, 4);
    displayedProducts.forEach(product => {
        const links = screen.getAllByRole('link', { name: new RegExp(product.title, 'i') });
        expect(links.some(link => link.getAttribute('href') === product.href)).toBe(true);
    });
  });
});
