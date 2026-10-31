import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer } from './Toast';

const noop = () => {};

describe('Toast', () => {
  // Rendering
  it('renders message text', () => {
    render(<Toast id="1" variant="success" message="Hello toast" onDismiss={noop} />);
    expect(screen.getByText('Hello toast')).toBeInTheDocument();
  });

  it('has role="status" for screen readers', () => {
    render(<Toast id="1" variant="info" message="Info" onDismiss={noop} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite"', () => {
    render(<Toast id="1" variant="info" message="Info" onDismiss={noop} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  // Variants
  it.each(['success', 'error', 'warning', 'info', 'default'] as const)(
    'renders variant=%s without crashing',
    (variant) => {
      render(<Toast id="1" variant={variant} message={`${variant} message`} onDismiss={noop} />);
      expect(screen.getByText(`${variant} message`)).toBeInTheDocument();
    },
  );

  it('applies data-variant attribute', () => {
    render(<Toast id="1" variant="error" message="Error!" onDismiss={noop} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'error');
  });

  // Dismiss
  it('calls onDismiss with id when close button clicked', async () => {
    const onDismiss = jest.fn();
    render(<Toast id="toast-abc" variant="success" message="Done" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByLabelText('Đóng thông báo'));
    expect(onDismiss).toHaveBeenCalledWith('toast-abc');
  });

  it('dismiss button has accessible label', () => {
    render(<Toast id="1" variant="default" message="Hi" onDismiss={noop} />);
    expect(screen.getByLabelText('Đóng thông báo')).toBeInTheDocument();
  });

  // Action button
  it('renders action button when action provided', () => {
    render(
      <Toast
        id="1"
        variant="warning"
        message="Warning"
        action={{ label: 'Undo', onClick: noop }}
        onDismiss={noop}
      />,
    );
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('calls action.onClick when action button clicked', async () => {
    const onClick = jest.fn();
    render(
      <Toast
        id="1"
        variant="warning"
        message="Slippage"
        action={{ label: 'View', onClick }}
        onDismiss={noop}
      />,
    );
    await userEvent.click(screen.getByText('View'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when no action', () => {
    render(<Toast id="1" variant="info" message="No action" onDismiss={noop} />);
    expect(screen.queryByRole('button', { name: /view|undo/i })).not.toBeInTheDocument();
  });

  // No icon for 'default' variant
  it('renders no icon SVG for default variant', () => {
    const { container } = render(<Toast id="1" variant="default" message="Default" onDismiss={noop} />);
    // The icon is aria-hidden — no SVG with class 'icon' should appear
    expect(container.querySelector('[data-variant="default"] svg')).not.toBeInTheDocument();
  });

  it('renders icon SVG for success variant', () => {
    const { container } = render(<Toast id="1" variant="success" message="OK" onDismiss={noop} />);
    // 2 SVGs: icon + dismiss
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });
});

describe('ToastContainer', () => {
  const toasts = [
    { id: '1', variant: 'success' as const, message: 'First',  onDismiss: noop },
    { id: '2', variant: 'error'   as const, message: 'Second', onDismiss: noop },
  ];

  it('renders all toasts', () => {
    render(<ToastContainer toasts={toasts} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders nothing when toasts is empty', () => {
    const { container } = render(<ToastContainer toasts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has role="region" for landmark navigation', () => {
    render(<ToastContainer toasts={toasts} />);
    expect(screen.getByRole('region', { name: 'Thông báo' })).toBeInTheDocument();
  });

  it.each(['bottom-center', 'top-right', 'top-center'] as const)(
    'applies data-position="%s"',
    (position) => {
      render(<ToastContainer toasts={toasts} position={position} />);
      expect(screen.getByRole('region')).toHaveAttribute('data-position', position);
    },
  );
});
