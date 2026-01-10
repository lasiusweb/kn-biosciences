import React from 'react';
import { render, screen } from '@testing-library/react';
import { SpecializationSection } from './specialization-section';
import { SPECIALIZATIONS } from '@/lib/constants';

describe('SpecializationSection', () => {
  it('renders correctly with heading', () => {
    render(<SpecializationSection />);
    expect(screen.getByText(/Our Specialization/i)).toBeInTheDocument();
  });

  it('renders all specialization cards', () => {
    render(<SpecializationSection />);
    SPECIALIZATIONS.forEach(spec => {
      expect(screen.getByText(spec.title)).toBeInTheDocument();
      expect(screen.getByText(spec.description)).toBeInTheDocument();
    });
  });

  it('has links to correct segments', () => {
    render(<SpecializationSection />);
    SPECIALIZATIONS.forEach(spec => {
        const links = screen.getAllByRole('link', { name: /Learn More/i });
        expect(links.some(link => link.getAttribute('href') === spec.href)).toBe(true);
    });
  });
});
