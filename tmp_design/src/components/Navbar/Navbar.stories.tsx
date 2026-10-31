import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Navbar, type NavItem } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title:     'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Fixed bottom navigation bar. 3–5 items. Touch target ≥ 44px. Active item highlighted with brand blue.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Navbar>;

// ─── SVG icon helpers ─────────────────────────────────────────

function HomeIcon({ active = false }: { active?: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12L12 3l9 9M5 10v10h5v-6h4v6h5V10"/></svg>
  );
}
function WalletIcon({ active = false }: { active?: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 7H3a2 2 0 00-2 2v9a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2zm-1 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM22 5H5l2-2h15v2z"/></svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="7" width="22" height="15" rx="2"/><path d="M1 10h22M16 14h.01"/></svg>
  );
}
function SwapIcon({ active = false }: { active?: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3l4 4-4 4V7H8V5h8V3zM8 21l-4-4 4-4v4h8v2H8v2z"/></svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3l4 4-4 4V7H3M8 21l-4-4 4-4v4h13"/></svg>
  );
}
function HistoryIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}
function ProfileIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M2 21c0-5.5 4.5-8 10-8s10 2.5 10 8"/></svg>;
}

// ─── Item definitions ─────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { key: 'home',    label: 'Trang chủ', icon: <HomeIcon />,    iconActive: <HomeIcon active /> },
  { key: 'wallet',  label: 'Ví',        icon: <WalletIcon />,  iconActive: <WalletIcon active /> },
  { key: 'swap',    label: 'Swap',      icon: <SwapIcon />,    iconActive: <SwapIcon active /> },
  { key: 'history', label: 'Lịch sử',  icon: <HistoryIcon /> },
  { key: 'profile', label: 'Tôi',       icon: <ProfileIcon /> },
];

// ─── Stories ──────────────────────────────────────────────────

function NavbarDemo({ items = NAV_ITEMS }: { items?: NavItem[] }) {
  const [active, setActive] = useState('home');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-background-primary)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
        Active: <strong style={{ marginLeft: 6, color: 'var(--color-text-primary)' }}>{active}</strong>
      </div>
      <Navbar items={items} activeKey={active} onChange={setActive} />
    </div>
  );
}

export const Default: Story = {
  render: () => <NavbarDemo />,
};

export const ThreeItems: Story = {
  name: '3 items',
  render: () => <NavbarDemo items={NAV_ITEMS.slice(0, 3)} />,
};

export const WithBadge: Story = {
  name: 'With badge',
  render: () => (
    <NavbarDemo
      items={[
        { key: 'home',    label: 'Home',    icon: <HomeIcon />,    iconActive: <HomeIcon active /> },
        { key: 'wallet',  label: 'Wallet',  icon: <WalletIcon />,  iconActive: <WalletIcon active />, badge: 3 },
        { key: 'swap',    label: 'Swap',    icon: <SwapIcon />,    iconActive: <SwapIcon active /> },
        { key: 'history', label: 'History', icon: <HistoryIcon />, badge: 127 },
        { key: 'profile', label: 'Profile', icon: <ProfileIcon /> },
      ]}
    />
  ),
};

export const WithDisabledItem: Story = {
  name: 'Disabled item',
  render: () => (
    <NavbarDemo
      items={[
        { key: 'home',    label: 'Home',   icon: <HomeIcon />, iconActive: <HomeIcon active /> },
        { key: 'wallet',  label: 'Wallet', icon: <WalletIcon /> },
        { key: 'swap',    label: 'Swap',   icon: <SwapIcon />, disabled: true },
        { key: 'profile', label: 'Profile',icon: <ProfileIcon /> },
      ]}
    />
  ),
};
