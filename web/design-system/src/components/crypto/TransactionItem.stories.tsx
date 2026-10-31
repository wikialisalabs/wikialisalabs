import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TransactionItem } from './TransactionItem';
import { BalanceDisplay,  type QuickAction } from './BalanceDisplay';
import { QRCodeDisplay } from './QRCodeDisplay';

// ─── TransactionItem ──────────────────────────────────────────

const meta: Meta<typeof TransactionItem> = {
  title:     'Crypto/TransactionItem',
  component: TransactionItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Transaction list item for 5 types × 4 statuses. Clickable variant for detail navigation.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TransactionItem>;

export const AllTypes: Story = {
  name: 'All Types',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 380 }}>
      <TransactionItem type="send"    amount="-$25.00"   status="completed"  timestamp="2 giờ trước"    counterparty="bob.axq" onClick={() => {}} />
      <TransactionItem type="receive" amount="+$100.00"  status="completed"  timestamp="Hôm qua"         counterparty="alice.axq" onClick={() => {}} />
      <TransactionItem type="swap"    amount="0.01 BTC"  subLabel="BTC → ETH" status="processing" timestamp="5 phút trước"  onClick={() => {}} />
      <TransactionItem type="buy"     amount="+0.002 BTC" status="pending"   timestamp="Vừa xong"        onClick={() => {}} />
      <TransactionItem type="fee"     amount="-$0.50"    status="completed"  timestamp="2 giờ trước"    onClick={() => {}} />
    </div>
  ),
};

export const AllStatuses: Story = {
  name: 'All Statuses',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 380 }}>
      <TransactionItem type="send" amount="-$10.00" status="completed"  timestamp="1 ngày trước" />
      <TransactionItem type="send" amount="-$10.00" status="pending"    timestamp="Vừa xong" />
      <TransactionItem type="send" amount="-$10.00" status="processing" timestamp="30 giây trước" />
      <TransactionItem type="send" amount="-$10.00" status="failed"     timestamp="2 giờ trước" />
    </div>
  ),
};

export const DarkModeTx: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 380 }}>
      <TransactionItem type="receive" amount="+$100.00" status="completed"  timestamp="Hôm qua" counterparty="alice.axq" onClick={() => {}} />
      <TransactionItem type="send"    amount="-$25.00"  status="pending"    timestamp="Vừa xong" counterparty="bob.kpx"  onClick={() => {}} />
    </div>
  ),
};

// ─── BalanceDisplay ───────────────────────────────────────────

export const BalanceDisplayStory: Story = {
  name: 'BalanceDisplay',
  render: () => {
    const actions: QuickAction[] = [
      { label: 'Gửi',    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 14V6m0 0L6 10m4-4l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, onClick: () => {} },
      { label: 'Nhận',   icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 6v8m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, onClick: () => {} },
      { label: 'Mua',    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/></svg>, onClick: () => {} },
      { label: 'Swap',   icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4l3 3-3 3M7 16l-3-3 3-3M16 7H8M4 13h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, onClick: () => {} },
    ];
    return <BalanceDisplay fiatAmount="$12,847.32" cryptoEquiv="0.3241 BTC" actions={actions} />;
  },
};

// ─── QRCodeDisplay ────────────────────────────────────────────

export const QRReceive: Story = {
  name: 'QRCodeDisplay — Receive',
  render: () => (
    <QRCodeDisplay
      address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
      coinName="Bitcoin (BTC)"
      variant="receive"
    />
  ),
};

export const QRInline: Story = {
  name: 'QRCodeDisplay — Inline',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: '1px solid var(--color-border-default)', borderRadius: 12 }}>
      <QRCodeDisplay address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" variant="inline" />
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Địa chỉ nhận BTC</p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>0x71C7…976F</p>
      </div>
    </div>
  ),
};

export const QRLoading: Story = {
  name: 'QRCodeDisplay — Loading',
  render: () => <QRCodeDisplay address="" variant="loading" />,
};

export const QRDark: Story = {
  name: 'QRCodeDisplay — Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => (
    <QRCodeDisplay
      address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
      coinName="Ethereum (ETH)"
      variant="receive"
    />
  ),
};
