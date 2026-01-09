import { render, screen } from '@testing-library/react';
import { SearchBar } from './search-bar';

describe('SearchBar Component', () => {
  it('renders the search input with placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<SearchBar />);
    // type="search" has role "searchbox"
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
