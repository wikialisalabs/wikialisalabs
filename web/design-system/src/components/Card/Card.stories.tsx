import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title:     'Core / Card',
  component: Card,
  tags:      ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { title: 'Card Title', description: 'Secondary description text', bordered: true },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
};

export const WithContent: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Card
        title="BTC / USD"
        description="Bitcoin"
        metadata="Updated 2 min ago"
        footer={<span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>View details →</span>}
      >
        <p style={{ margin: 0, fontSize: 28, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          $67,421.00
        </p>
      </Card>
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Card clickable title="Clickable Card" description="Click or press Enter/Space" />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Card compact title="Compact Card" description="16px padding" />
    </div>
  ),
};

export const Elevated: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Card bordered={false} title="Elevated Card" description="Shadow instead of border" />
    </div>
  ),
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: 16 }}>
      {['BTC', 'ETH', 'SOL'].map((coin) => (
        <Card key={coin} clickable title={coin} description="Crypto asset" metadata="24h change" />
      ))}
    </div>
  ),
};
