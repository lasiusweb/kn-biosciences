import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroSlider } from './hero-slider';
import { HERO_SLIDES } from '@/lib/constants';

// Mock Embla Carousel as it doesn't run in JSDOM easily
jest.mock('embla-carousel-react', () => {
  return jest.fn(() => [jest.fn(), null]);
});

describe('HeroSlider', () => {
  it('renders all slides', () => {
    render(<HeroSlider />);
    
    HERO_SLIDES.forEach(slide => {
      expect(screen.getByText(slide.title)).toBeInTheDocument();
      expect(screen.getByText(slide.description)).toBeInTheDocument();
      expect(screen.getAllByText(slide.cta).length).toBeGreaterThan(0);
    });
  });

  it('renders images with correct src', () => {
     render(<HeroSlider />);
     
     const images = screen.getAllByRole('img');
     // Some images might be in the carousel clones if not mocked perfectly, 
     // but at least our main ones should be there.
     HERO_SLIDES.forEach((slide, index) => {
        const img = images.find(i => i.getAttribute('src')?.includes(encodeURIComponent(slide.image)));
        // Next.js Image component transforms src, so we check if it contains the original URL
        expect(img).toBeDefined();
     });
  });

  it('has "Get Quote" CTA that links to /quote', () => {
    render(<HeroSlider />);
    const getQuoteLinks = screen.getAllByRole('link', { name: /Get Quote/i });
    expect(getQuoteLinks[0]).toHaveAttribute('href', '/quote');
  });
});
