import { render, screen, fireEvent } from '@testing-library/react';
import { ProductVariantSelector } from './product-variant-selector';

const mockVariants = [
  {
    id: 'v1',
    name: 'Color',
    type: 'swatch',
    options: [
      { id: 'o1', value: 'Green', color: '#00ff00' },
      { id: 'o2', value: 'Brown', color: '#8b4513' },
    ],
  },
  {
    id: 'v2',
    name: 'Size',
    type: 'dropdown',
    options: [
      { id: 'o3', value: '1kg' },
      { id: 'o4', value: '5kg' },
    ],
  },
];

describe('ProductVariantSelector Component', () => {
  it('renders swatches and dropdowns', () => {
    render(<ProductVariantSelector variants={mockVariants} onSelect={jest.fn()} />);
    
    // Check Color swatches
    expect(screen.getAllByText(/Color/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Green/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Brown/i)).toBeInTheDocument();

    // Check Size dropdown
    expect(screen.getAllByText(/Size/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('triggers onSelect when an option is changed', () => {
    const handleSelect = jest.fn();
    render(<ProductVariantSelector variants={mockVariants} onSelect={handleSelect} />);
    
    // Select a swatch
    fireEvent.click(screen.getByLabelText(/Brown/i));
    expect(handleSelect).toHaveBeenCalledWith('v1', 'o2');

    // Select from dropdown
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'o4' } });
    expect(handleSelect).toHaveBeenCalledWith('v2', 'o4');
  });
});
