import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Toast, ToastContainer, type ToastVariant } from './Toast';
import { useToast } from '../../hooks/useToast';

const meta: Meta<typeof Toast> = {
  title:     'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Transient notification banners — use `useToast()` hook + `<ToastContainer/>` together.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Toast>;

const noop = () => {};

// ─── Static previews of each variant ─────────────────────────

export const AllVariants: Story = {
  name: 'All Variants (static)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
      {(['success', 'error', 'warning', 'info', 'default'] as ToastVariant[]).map((variant) => (
        <Toast
          key={variant}
          id={variant}
          variant={variant}
          message={`Toast variant: ${variant}`}
          onDismiss={noop}
        />
      ))}
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Toast
      id="with-action"
      variant="warning"
      message="Slippage cao hơn 3% — tiếp tục?"
      action={{ label: 'Xem chi tiết', onClick: () => alert('action clicked') }}
      onDismiss={noop}
    />
  ),
};

export const LongMessage: Story = {
  render: () => (
    <Toast
      id="long"
      variant="info"
      message="Giao dịch của bạn đang chờ xác nhận trên blockchain Axioledger. Thường mất 10–30 giây."
      onDismiss={noop}
    />
  ),
};

// ─── Interactive demo with useToast hook ──────────────────────

export const Interactive: Story = {
  name: 'Interactive (useToast hook)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { toast, toasts, dismiss } = useToast();

    // Map hook toasts to ToastItemProps
    const toastItems = toasts.map((t) => ({
      id:        t.id,
      variant:   t.variant,
      message:   t.message,
      action:    t.options?.action,
      onDismiss: dismiss,
    }));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['success', 'error', 'warning', 'info', 'default'] as ToastVariant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => (toast as Record<string, (m: string) => void>)[v](`Thông báo ${v}!`)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid var(--color-border-default)',
                background: 'var(--color-surface-raised)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {v}
            </button>
          ))}
          <button
            type="button"
            onClick={() => toast.warning('Slippage cao!', {
              action: { label: 'Xem chi tiết', onClick: () => alert('detail') },
            })}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-surface-raised)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            with action
          </button>
        </div>

        {/* Inline container for Storybook (normally mounted by AxioProvider) */}
        <div style={{ position: 'relative', width: 400, minHeight: 120 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {toastItems.map((t) => <Toast key={t.id} {...t} />)}
          </div>
        </div>
      </div>
    );
  },
};

// ─── Container positions ──────────────────────────────────────

export const ContainerDemo: Story = {
  name: 'ToastContainer positions',
  render: () => {
    const items = [
      { id: '1', variant: 'success' as ToastVariant, message: 'bottom-center (default)', onDismiss: noop },
    ];
    return (
      <div style={{ position: 'relative', height: 200, border: '1px dashed var(--color-border-default)', borderRadius: 8 }}>
        <p style={{ padding: 16, color: 'var(--color-text-secondary)', fontSize: 13 }}>
          ToastContainer — rendered at fixed position. Resize window to test.
        </p>
        <ToastContainer toasts={items} position="bottom-center" />
      </div>
    );
  },
};
