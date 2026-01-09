import { render, screen } from '@testing-library/react';
import { TopBar } from './top-bar';

describe('TopBar Component', () => {
  it('renders contact information', () => {
    render(<TopBar />);
    // Phone and Email from product guide logic or mock
    expect(screen.getByText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
  });

  it('renders Login and Cart links', () => {
    render(<TopBar />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });
});
