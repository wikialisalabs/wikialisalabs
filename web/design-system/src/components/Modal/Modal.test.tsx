import React from 'react'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';
import { BottomSheet } from './BottomSheet';

// ─── Modal Tests ──────────────────────────────────────────────

describe('Modal', () => {
  const baseProps = {
    open: true,
    onClose: jest.fn(),
    title: 'Test Modal',
  };

  beforeEach(() => jest.clearAllMocks());

  // Rendering
  it('renders when open=true', () => {
    render(<Modal {...baseProps}><p>Body content</p></Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(<Modal {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ARIA attributes
  it('has aria-modal="true"', () => {
    render(<Modal {...baseProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to title', () => {
    render(<Modal {...baseProps} />);
    const dialog  = screen.getByRole('dialog');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId!)).toHaveTextContent('Test Modal');
  });

  it('does not set aria-labelledby when no title', () => {
    render(<Modal open={true} onClose={jest.fn()} />);
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
  });

  // Close button
  it('calls onClose when close button clicked', async () => {
    const onClose = jest.fn();
    render(<Modal {...baseProps} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('Đóng'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Escape key
  it('calls onClose when Escape pressed', () => {
    const onClose = jest.fn();
    render(<Modal {...baseProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Overlay click
  it('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...baseProps} onClose={onClose} />);
    const overlay = document.querySelector('[data-variant]') as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose on overlay click when closeOnOverlay=false', () => {
    const onClose = jest.fn();
    render(<Modal {...baseProps} onClose={onClose} closeOnOverlay={false} />);
    const overlay = document.querySelector('[data-variant]') as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  // Footer actions
  it('renders primary and secondary action buttons', () => {
    render(
      <Modal
        {...baseProps}
        primaryAction={{ label: 'Xác nhận', onClick: jest.fn() }}
        secondaryAction={{ label: 'Huỷ', onClick: jest.fn() }}
      />,
    );
    expect(screen.getByText('Xác nhận')).toBeInTheDocument();
    expect(screen.getByText('Huỷ')).toBeInTheDocument();
  });

  it('calls primaryAction.onClick when primary btn clicked', async () => {
    const onClick = jest.fn();
    render(<Modal {...baseProps} primaryAction={{ label: 'OK', onClick }} />);
    await userEvent.click(screen.getByText('OK'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables primary button when loading=true', () => {
    render(<Modal {...baseProps} primaryAction={{ label: 'Gửi', onClick: jest.fn(), loading: true }} />);
    expect(screen.getByRole('button', { name: /gửi/i })).toBeDisabled();
  });

  it('shows spinner SVG when primary loading=true', () => {
    render(<Modal {...baseProps} primaryAction={{ label: 'Gửi', onClick: jest.fn(), loading: true }} />);
    // The label is replaced by the spinner, text not visible
    expect(screen.queryByText('Gửi')).not.toBeInTheDocument();
  });

  // Variants
  it.each(['info', 'confirm', 'success', 'error', 'form', 'custom'] as const)(
    'renders variant=%s without crashing',
    (variant) => {
      render(<Modal {...baseProps} variant={variant} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    },
  );

  // Body lock
  it('locks body scroll when open', () => {
    render(<Modal {...baseProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when unmounted', () => {
    const { unmount } = render(<Modal {...baseProps} />);
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

// ─── BottomSheet Tests ────────────────────────────────────────

describe('BottomSheet', () => {
  const baseProps = { open: true, onClose: jest.fn(), title: 'Test Sheet' };

  beforeEach(() => jest.clearAllMocks());

  it('renders when open=true', () => {
    render(<BottomSheet {...baseProps}><p>Content</p></BottomSheet>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Sheet')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(<BottomSheet {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    render(<BottomSheet {...baseProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = jest.fn();
    render(<BottomSheet {...baseProps} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('Đóng'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape pressed', () => {
    const onClose = jest.fn();
    render(<BottomSheet {...baseProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders without title when title omitted', () => {
    render(<BottomSheet open={true} onClose={jest.fn()}><p>No title</p></BottomSheet>);
    expect(screen.getByText('No title')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Đóng' })).not.toBeInTheDocument();
  });
});
