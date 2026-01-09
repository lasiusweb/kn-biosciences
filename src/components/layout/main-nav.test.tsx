import { render, screen, fireEvent } from '@testing-library/react';
import { MainNav } from './main-nav';

describe('MainNav Component', () => {
  it('renders the brand logo text', () => {
    render(<MainNav />);
    expect(screen.getByText(/K N BIO/i)).toBeInTheDocument();
    expect(screen.getByText(/Sciences/i)).toBeInTheDocument();
  });

  it('renders main navigation links', () => {
    render(<MainNav />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/organic farming/i)).toBeInTheDocument();
  });

  it('renders Shop and By Farm Segment as triggers', () => {
    render(<MainNav />);
    expect(screen.getByRole('button', { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /by farm segment/i })).toBeInTheDocument();
  });
});
