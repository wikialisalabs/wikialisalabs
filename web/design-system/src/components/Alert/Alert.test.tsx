import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecurityAlert } from './Alert';
import { Alert }          from './Alert';

// ─── Alert tests ─────────────────────────────────────────────

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert variant="info">Info message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it.each(['success', 'error', 'warning', 'info'] as const)('renders variant=%s', (v) => {
    render(<Alert variant={v}>Text</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('data-variant', v);
  });

  it('renders title', () => {
    render(<Alert variant="info" title="My Title">Body</Alert>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('shows dismiss button when dismissible=true', () => {
    render(<Alert variant="warning" dismissible onDismiss={jest.fn()}>W</Alert>);
    expect(screen.getByLabelText('Đóng thông báo')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss clicked', async () => {
    const fn = jest.fn();
    render(<Alert variant="error" dismissible onDismiss={fn}>Err</Alert>);
    await userEvent.click(screen.getByLabelText('Đóng thông báo'));
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ─── SecurityAlert tests ──────────────────────────────────────

describe('SecurityAlert', () => {
  // ────────────────────────────────────────────────────────────
  // HARD RULE: level="blocked" MUST disable Sign button.
  // This cannot be overridden. These tests enforce that invariant.
  // ────────────────────────────────────────────────────────────

  it('renders with role="alert"', () => {
    render(<SecurityAlert level="safe" name="alice.axq" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows TLP level label', () => {
    render(<SecurityAlert level="safe" name="alice.axq" />);
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('shows name', () => {
    render(<SecurityAlert level="caution" name="bob.kpx" />);
    expect(screen.getByText('bob.kpx')).toBeInTheDocument();
  });

  it('shows custom reason', () => {
    render(<SecurityAlert level="safe" name="alice.axq" reason="Custom reason" />);
    expect(screen.getByText('Custom reason')).toBeInTheDocument();
  });

  it('shows sign button when onSign provided', () => {
    render(<SecurityAlert level="safe" name="alice.axq" onSign={jest.fn()} />);
    expect(screen.getByRole('button', { name: /sign transaction/i })).toBeInTheDocument();
  });

  // ─── CRITICAL SECURITY TESTS ─────────────────────────────

  it('BLOCKED: sign button is disabled when level="blocked"', () => {
    render(<SecurityAlert level="blocked" name="0x1234abc" onSign={jest.fn()} />);
    const btn = screen.getByRole('button', { name: /sign transaction/i });
    expect(btn).toBeDisabled();
  });

  it('BLOCKED: sign button has aria-disabled="true" when level="blocked"', () => {
    render(<SecurityAlert level="blocked" name="0xdeadbeef" onSign={jest.fn()} />);
    const btn = screen.getByRole('button', { name: /sign transaction/i });
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('BLOCKED: sign button has data-blocked="true"', () => {
    render(<SecurityAlert level="blocked" name="0xdeadbeef" onSign={jest.fn()} />);
    const btn = screen.getByRole('button', { name: /sign transaction/i });
    expect(btn).toHaveAttribute('data-blocked', 'true');
  });

  it('BLOCKED: onSign is NOT called even if button somehow triggered', async () => {
    const onSign = jest.fn();
    render(<SecurityAlert level="blocked" name="0xdeadbeef" onSign={onSign} />);
    const btn = screen.getByRole('button', { name: /sign transaction/i });
    // Simulate direct click — should not fire because button is disabled
    fireEvent.click(btn);
    expect(onSign).not.toHaveBeenCalled();
  });

  it('SAFE: sign button is enabled when level="safe"', () => {
    render(<SecurityAlert level="safe" name="alice.axq" onSign={jest.fn()} />);
    const btn = screen.getByRole('button', { name: /sign transaction/i });
    expect(btn).not.toBeDisabled();
  });

  it('SAFE: onSign is called when sign button clicked', async () => {
    const onSign = jest.fn();
    render(<SecurityAlert level="safe" name="alice.axq" onSign={onSign} />);
    await userEvent.click(screen.getByRole('button', { name: /sign transaction/i }));
    expect(onSign).toHaveBeenCalledTimes(1);
  });

  it('CAUTION: sign button is enabled when level="caution"', () => {
    render(<SecurityAlert level="caution" name="bob.kpx" onSign={jest.fn()} />);
    expect(screen.getByRole('button', { name: /sign transaction/i })).not.toBeDisabled();
  });

  it('BLOCKED: dismiss button NOT shown (cannot dismiss blocked alert)', () => {
    render(<SecurityAlert level="blocked" name="0x0" onDismiss={jest.fn()} />);
    expect(screen.queryByLabelText('Đóng cảnh báo')).not.toBeInTheDocument();
  });

  it('SAFE: dismiss button shown and callable', async () => {
    const onDismiss = jest.fn();
    render(<SecurityAlert level="safe" name="alice.axq" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByLabelText('Đóng cảnh báo'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows custom sign label', () => {
    render(<SecurityAlert level="safe" name="alice.axq" onSign={jest.fn()} signLabel="Confirm Transfer" />);
    expect(screen.getByRole('button', { name: /confirm transfer/i })).toBeInTheDocument();
  });

  it.each([
    ['safe',    'Safe'],
    ['caution', 'Caution'],
    ['blocked', 'Blocked'],
    ['system',  'System'],
  ] as const)('shows correct TLP label for level=%s', (level, label) => {
    render(<SecurityAlert level={level} name="test.axq" />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
