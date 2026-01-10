import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrustSection } from './trust-section';
import { TESTIMONIALS, TRUST_INDICATORS } from '@/lib/constants';

describe('TrustSection', () => {
  it('renders "Why Choose Us" heading', () => {
    render(<TrustSection />);
    expect(screen.getByText(/Why Choose Us/i)).toBeInTheDocument();
  });

  it('renders all trust indicators', () => {
    render(<TrustSection />);
    TRUST_INDICATORS.forEach(indicator => {
      expect(screen.getByText(indicator.label)).toBeInTheDocument();
      expect(screen.getByText(indicator.value)).toBeInTheDocument();
    });
  });

  it('renders all testimonials', () => {
    render(<TrustSection />);
    TESTIMONIALS.forEach(t => {
      expect(screen.getByText(new RegExp(t.author, 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(t.role, 'i'))).toBeInTheDocument();
    });
  });
});
