import { render, screen, fireEvent } from '@testing-library/react';
import { CommonPageLevelErrorMessage } from './common-page-level-error-message';
import { AlertCircle } from 'lucide-react';

describe('CommonPageLevelErrorMessage Component', () => {
  it('renders with title and description', () => {
    render(
      <CommonPageLevelErrorMessage
        title="Page Error"
        description="Something went wrong while loading the page."
      />
    );

    expect(screen.getByText('Page Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong while loading the page.')).toBeInTheDocument();
  });

  it('renders with a custom icon', () => {
    // Note: Testing actual icon rendering usually involves checking for SVG or class names.
    // Here we just check if it renders without crashing.
    render(
      <CommonPageLevelErrorMessage
        title="Error"
        icon={<AlertCircle data-testid="error-icon" />}
      />
    );
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('renders an action button and triggers event', () => {
    const handleAction = jest.fn();
    render(
      <CommonPageLevelErrorMessage
        title="Error"
        actionLabel="Retry"
        onAction={handleAction}
      />
    );

    const button = screen.getByText('Retry');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
