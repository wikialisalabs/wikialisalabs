import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CryptoAssetCard } from './CryptoAssetCard';
import { PriceTicker } from './PriceTicker';

// ─── CryptoAssetCard ──────────────────────────────────────────

const meta: Meta<typeof CryptoAssetCard> = {
  title:     'Crypto/CryptoAssetCard',
  component: CryptoAssetCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Asset display in 3 variants. Full includes sparkline + balance.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CryptoAssetCard>;

const BTC_SPARK = [42000, 43200, 41800, 44500, 43900, 46200, 45800];

export const Compact: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <CryptoAssetCard
        variant="compact"
        coinName="Bitcoin"
        ticker="BTC"
        price="$45,832.00"
        change="+14.29%"
        changeType="positive"
        onClick={() => {}}
      />
    </div>
  ),
};

export const Full: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <CryptoAssetCard
        variant="full"
        coinName="Bitcoin"
        ticker="BTC"
        price="$45,832.00"
        change="+14.29%"
        changeType="positive"
        balance="0.0483 BTC"
        sparkline={BTC_SPARK}
        onClick={() => {}}
      />
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div style={{ width: 180 }}>
      <CryptoAssetCard
        variant="minimal"
        coinName="Ethereum"
        ticker="ETH"
        price="$2,387.64"
        change="-2.1%"
        changeType="negative"
      />
    </div>
  ),
};

export const HorizontalList: Story = {
  name: 'Horizontal list (compact)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      {[
        { coinName: 'Bitcoin',  ticker: 'BTC', price: '$45,832', change: '+14.29%', changeType: 'positive' as const },
        { coinName: 'Ethereum', ticker: 'ETH', price: '$2,387',  change: '-2.1%',  changeType: 'negative' as const },
        { coinName: 'AXQ Token',ticker: 'AXQ', price: '$0.0421', change: '+0.5%',  changeType: 'positive' as const },
      ].map((p) => (
        <CryptoAssetCard key={p.ticker} variant="compact" {...p} onClick={() => {}} />
      ))}
    </div>
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
      <CryptoAssetCard variant="compact" coinName="Bitcoin" ticker="BTC" price="$45,832" change="+14.29%" changeType="positive" onClick={() => {}} />
      <CryptoAssetCard variant="full"    coinName="Ethereum" ticker="ETH" price="$2,387" change="-2.1%"  changeType="negative" balance="1.32 ETH" sparkline={[2000,2200,2100,2400,2300,2500,2387]} onClick={() => {}} />
    </div>
  ),
};

// ─── PriceTicker ──────────────────────────────────────────────

export const PriceTickerAllStates: Story = {
  name: 'PriceTicker — All States',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <PriceTicker value="+14.29%" direction="up"      ticker="BTC" />
      <PriceTicker value="-2.10%"  direction="down"    ticker="ETH" />
      <PriceTicker value="0.00%"   direction="neutral" ticker="USDT" />
      <PriceTicker value="$45,832" direction="up" />
    </div>
  ),
};
