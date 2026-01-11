import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('Footer Component', () => {
  it('renders brand information and logo', () => {
    render(<Footer />);
    expect(screen.getAllByText(/K N BIO/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Sciences/i)[0]).toBeInTheDocument();
  });

  it('renders navigation link sections', () => {
    render(<Footer />);
    // Main Sections
    expect(screen.getByText(/Quick Links/i)).toBeInTheDocument();
    expect(screen.getByText(/Segments/i)).toBeInTheDocument();
    expect(screen.getByText(/Company/i)).toBeInTheDocument();
  });

  it('renders specific navigation links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /^Home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Shop/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Services/i })).toBeInTheDocument();
  });

  it('renders company contact details and address', () => {
    render(<Footer />);
    expect(screen.getByText(/Head Office/i)).toBeInTheDocument();
    expect(screen.getByText(/Hyderabad/i)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    expect(screen.getByLabelText(/Facebook/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Twitter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Instagram/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LinkedIn/i)).toBeInTheDocument();
  });
});
