import { render, screen } from '@testing-library/react';
import { CommonFocusTrapManager } from './common-focus-trap-manager';

// Mock the library to verify we are passing the correct props
jest.mock('focus-trap-react', () => {
  return ({ children, active, focusTrapOptions }: any) => (
    <div 
      data-testid="mock-focus-trap" 
      data-active={active.toString()}
      // We store the presence of the handler, not the function itself
      data-has-deactivate={focusTrapOptions.onDeactivate ? 'true' : 'false'}
      data-fallback={focusTrapOptions.fallbackFocus}
    >
      {children}
    </div>
  );
});

describe('CommonFocusTrapManager', () => {
  it('renders children wrapped in FocusTrap with correct active state and options', () => {
    const handleDeactivate = jest.fn();
    render(
      <CommonFocusTrapManager active={true} onDeactivate={handleDeactivate}>
        <button>Inside</button>
      </CommonFocusTrapManager>
    );

    const trap = screen.getByTestId('mock-focus-trap');
    expect(trap).toBeInTheDocument();
    expect(trap).toHaveAttribute('data-active', 'true');
    expect(trap).toHaveAttribute('data-has-deactivate', 'true');
    expect(trap).toHaveAttribute('data-fallback', 'body');
    expect(screen.getByText('Inside')).toBeInTheDocument();
  });

  it('passes active=false correctly', () => {
    render(
      <CommonFocusTrapManager active={false}>
        <button>Inside</button>
      </CommonFocusTrapManager>
    );

    const trap = screen.getByTestId('mock-focus-trap');
    expect(trap).toHaveAttribute('data-active', 'false');
  });
});