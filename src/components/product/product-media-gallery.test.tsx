import { render, screen } from '@testing-library/react';
import { ProductMediaGallery } from './product-media-gallery';

// Mock Embla Carousel
jest.mock('embla-carousel-react', () => {
  return jest.fn(() => [jest.fn(), null]);
});

const mockMedia = [
  { url: 'https://example.com/image1.jpg', alt: 'Image 1', type: 'image' },
  { url: 'https://example.com/image2.jpg', alt: 'Image 2', type: 'image' },
];

describe('ProductMediaGallery Component', () => {
  it('renders correctly with media items', () => {
    render(<ProductMediaGallery media={mockMedia} />);
    
    // Check if main image or first item is rendered
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('image1.jpg'));
  });

  it('renders fallback when no media is provided', () => {
    render(<ProductMediaGallery media={[]} />);
    expect(screen.getByText(/No images available/i)).toBeInTheDocument();
  });

  it('renders thumbnails on desktop', () => {
    // We can't easily test media queries in JSDOM, but we can check if thumbnail container exists
    // and if it has the correct items.
    render(<ProductMediaGallery media={mockMedia} showThumbnails={true} />);
    const thumbnails = screen.getAllByRole('button', { name: /thumbnail/i });
    expect(thumbnails.length).toBe(mockMedia.length);
  });
});
