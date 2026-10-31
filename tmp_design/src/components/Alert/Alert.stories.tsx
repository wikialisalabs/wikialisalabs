import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Alert, SecurityAlert } from './Alert';

const meta: Meta<typeof Alert> = {
  title:     'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: { description: { component: '`Alert` — inline banner with left-accent border. `SecurityAlert` — TLP-aware panel that enforces Sign button lockout when `level="blocked"`.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Alert>;

// ─── Alert stories ────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'Alert — All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert variant="success" title="Giao dịch thành công">Đã gửi 0.05 BTC tới alice.axq</Alert>
      <Alert variant="error"   title="Lỗi kết nối">Không thể kết nối RPC. Thử lại sau.</Alert>
      <Alert variant="warning" title="Slippage cao">Slippage hiện tại 4.2% — vượt ngưỡng an toàn.</Alert>
      <Alert variant="info"    title="Thông báo hệ thống">Bảo trì mạng lúc 02:00 SA ngày mai.</Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  name: 'Alert — Dismissible',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [visible, setVisible] = useState(true);
    return visible
      ? <Alert variant="warning" title="Cảnh báo slippage" dismissible onDismiss={() => setVisible(false)}>
          Slippage hiện tại vượt 3%. Bạn có muốn tiếp tục?
        </Alert>
      : <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Alert đã đóng.</p>;
  },
};

export const AlertNoTitle: Story = {
  name: 'Alert — No Title',
  render: () => <Alert variant="info">Phiên làm việc sẽ hết hạn sau 5 phút.</Alert>,
};

// ─── SecurityAlert stories ────────────────────────────────────

export const SecuritySafe: Story = {
  name: 'SecurityAlert — Safe',
  render: () => (
    <SecurityAlert
      level="safe"
      name="alice.axq"
      onSign={() => alert('Signed!')}
      onDismiss={() => {}}
    />
  ),
};

export const SecurityCaution: Story = {
  name: 'SecurityAlert — Caution (.kpx)',
  render: () => (
    <SecurityAlert
      level="caution"
      name="defi-pool.kpx"
      reason="Đây là giao thức DeFi. Kiểm tra kỹ thông tin trước khi ký."
      onSign={() => alert('Signed!')}
      onDismiss={() => {}}
    />
  ),
};

export const SecurityBlocked: Story = {
  name: 'SecurityAlert — BLOCKED (sign disabled)',
  parameters: {
    docs: {
      description: {
        story: '**HARD RULE**: when `level="blocked"` the Sign button is always disabled — `pointer-events:none`, `disabled`, `aria-disabled`. This cannot be overridden.',
      },
    },
  },
  render: () => (
    <SecurityAlert
      level="blocked"
      name="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
      onSign={() => alert('This should never fire')}
    />
  ),
};

export const SecuritySystem: Story = {
  name: 'SecurityAlert — System (.sqx)',
  render: () => (
    <SecurityAlert
      level="system"
      name="bridge-relay.sqx"
      reason="Namespace nội bộ hệ thống. Chỉ ký nếu bạn khởi tạo giao dịch này."
      onSign={() => alert('Signed!')}
      onDismiss={() => {}}
    />
  ),
};

export const SecurityDark: Story = {
  name: 'SecurityAlert — Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SecurityAlert level="safe"    name="alice.axq"   onSign={() => {}} />
      <SecurityAlert level="caution" name="dex.kpx"     onSign={() => {}} />
      <SecurityAlert level="blocked" name="0xdeadbeef"  onSign={() => {}} />
    </div>
  ),
};
