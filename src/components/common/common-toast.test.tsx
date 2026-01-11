import { render, screen, fireEvent } from '@testing-library/react';
import { CommonToast } from './common-toast';
import { useToast } from '@/components/ui/use-toast';

// Mock component to trigger toast
const ToastTrigger = ({ title, description, variant }: any) => {
  const { toast } = useToast();
  return (
    <button
      onClick={() => toast({ title, description, variant })}
    >
      Show Toast
    </button>
  );
};

describe('CommonToast Component', () => {
  it('renders a toast with title and description', () => {
    render(
      <>
        <ToastTrigger title="Test Title" description="Test Description" />
        <CommonToast />
      </>
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders a destructive toast', () => {
    render(
      <>
        <ToastTrigger title="Error" description="Something went wrong" variant="destructive" />
        <CommonToast />
      </>
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    const toast = screen.getByText('Error').closest('li'); // Toast usually renders as li in Radix
    expect(toast).toHaveClass('destructive');
  });
});
