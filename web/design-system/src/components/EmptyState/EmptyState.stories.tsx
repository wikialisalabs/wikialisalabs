import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EmptyState, type EmptyStateVariant } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title:     'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: { description: { component: '7 contextual empty state variants with SVG illustrations, title, description, and optional CTA.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

const VARIANTS: EmptyStateVariant[] = [
  'no-transactions', 'no-results', 'no-notifications',
  'no-connection', 'error', 'empty-wallet', 'generic',
];

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ border: '1px dashed var(--color-border-default)', borderRadius: 12 }}>
          <EmptyState variant={v} />
        </div>
      ))}
    </div>
  ),
};

export const WithCTA: Story = {
  name: 'With CTA button',
  render: () => (
    <EmptyState
      variant="error"
      actionLabel="Thử lại"
      onAction={() => alert('retry clicked')}
    />
  ),
};

export const EmptyWallet: Story = {
  name: 'Empty Wallet',
  render: () => (
    <EmptyState
      variant="empty-wallet"
      actionLabel="Nạp tiền ngay"
      onAction={() => {}}
    />
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => <EmptyState variant="no-transactions" actionLabel="Gửi tiền" onAction={() => {}} />,
};
