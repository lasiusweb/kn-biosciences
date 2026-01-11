import { render, screen, fireEvent } from '@testing-library/react';
import { AccountSwitcherModal } from './account-switcher-modal';
import React from 'react';

describe('AccountSwitcherModal', () => {
  it('renders role options', () => {
    render(<AccountSwitcherModal isOpen={true} onClose={jest.fn()} onSwitch={jest.fn()} />);
    expect(screen.getByText(/Switch Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Farmer/i)).toBeInTheDocument();
    expect(screen.getByText(/Dealer/i)).toBeInTheDocument();
  });

  it('triggers onSwitch when a role is selected', () => {
    const handleSwitch = jest.fn();
    render(<AccountSwitcherModal isOpen={true} onClose={jest.fn()} onSwitch={handleSwitch} />);
    
    fireEvent.click(screen.getByText(/Dealer/i));
    expect(handleSwitch).toHaveBeenCalledWith('dealer');
  });
});
