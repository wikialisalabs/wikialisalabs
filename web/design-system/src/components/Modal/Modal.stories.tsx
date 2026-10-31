import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from './Modal';
import { BottomSheet } from './BottomSheet';

// ─── Modal Stories ────────────────────────────────────────────

const meta: Meta<typeof Modal> = {
  title:     'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A11y-compliant dialog — focus trap, Escape to close, focus restore.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo(props: Partial<React.ComponentProps<typeof Modal>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          background: 'var(--color-brand-blue, #0095FF)',
          color: '#FFF',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Open Modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        primaryAction={{ label: 'Xác nhận', onClick: () => setOpen(false) }}
        secondaryAction={{ label: 'Huỷ', onClick: () => setOpen(false) }}
        {...props}
      >
        {props.children ?? <p>Nội dung modal sẽ hiển thị ở đây.</p>}
      </Modal>
    </>
  );
}

export const Info: Story = {
  render: () => <ModalDemo variant="info" title="Thông báo" />,
};

export const Confirm: Story = {
  render: () => (
    <ModalDemo variant="confirm" title="Xác nhận xoá">
      <p>Bạn có chắc muốn xoá tài khoản này không? Hành động không thể hoàn tác.</p>
    </ModalDemo>
  ),
};

export const Success: Story = {
  render: () => (
    <ModalDemo variant="success" title="Giao dịch thành công">
      <p>Bạn đã gửi <strong>0.05 BTC</strong> thành công.</p>
    </ModalDemo>
  ),
};

export const Error: Story = {
  render: () => (
    <ModalDemo variant="error" title="Lỗi hệ thống">
      <p>Không thể kết nối tới mạng. Vui lòng thử lại.</p>
    </ModalDemo>
  ),
};

export const Form: Story = {
  render: () => (
    <ModalDemo variant="form" title="Nhập địa chỉ nhận">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Địa chỉ ví
          <input
            style={{
              display: 'block',
              width: '100%',
              marginTop: 6,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-surface-default)',
              color: 'var(--color-text-primary)',
              fontSize: 14,
              boxSizing: 'border-box',
            }}
            placeholder="0x... hoặc alice.axq"
          />
        </label>
      </div>
    </ModalDemo>
  ),
};

export const Custom: Story = {
  render: () => (
    <ModalDemo variant="custom" title="Giới thiệu tính năng">
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Tính năng Passkey đã sẵn sàng. Đăng ký ngay để bảo mật tốt hơn.
        </p>
      </div>
    </ModalDemo>
  ),
};

export const LoadingPrimary: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState(false);
    const handleConfirm = () => {
      setLoading(true);
      setTimeout(() => { setLoading(false); setOpen(false); }, 2000);
    };
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ padding: '8px 16px', background: '#0095FF', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
        >
          Open (with loading)
        </button>
        <Modal
          open={open}
          onClose={() => !loading && setOpen(false)}
          variant="confirm"
          title="Gửi giao dịch"
          primaryAction={{ label: 'Gửi ngay', onClick: handleConfirm, loading }}
          secondaryAction={{ label: 'Huỷ', onClick: () => setOpen(false), disabled: loading }}
        >
          <p>Xác nhận gửi <strong>0.1 ETH</strong> tới địa chỉ <code>alice.axq</code>?</p>
        </Modal>
      </>
    );
  },
};

// ─── BottomSheet Stories ─────────────────────────────────────

export const BottomSheetInfo: Story = {
  name: 'BottomSheet / Info',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ padding: '8px 16px', background: '#0095FF', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
        >
          Open Bottom Sheet
        </button>
        <BottomSheet open={open} onClose={() => setOpen(false)} title="Chi tiết giao dịch" variant="info">
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Giao dịch đang chờ xác nhận trên mạng Axioledger. Thường mất 10–30 giây.
          </p>
        </BottomSheet>
      </>
    );
  },
};

export const BottomSheetConfirm: Story = {
  name: 'BottomSheet / Confirm',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ padding: '8px 16px', background: '#FF3D71', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
        >
          Xoá tài sản
        </button>
        <BottomSheet open={open} onClose={() => setOpen(false)} title="Xác nhận xoá" variant="confirm">
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Tài sản sẽ bị xoá khỏi ví. Hành động này không thể hoàn tác.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setOpen(false)}
              style={{ flex: 1, height: 48, borderRadius: 10, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Huỷ
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{ flex: 1, height: 48, borderRadius: 10, border: 'none', background: '#FF3D71', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}
            >
              Xoá
            </button>
          </div>
        </BottomSheet>
      </>
    );
  },
};
