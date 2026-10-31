import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NamespaceBadge } from './NamespaceBadge';
import { AddressDisplay } from './AddressDisplay';

// ─── NamespaceBadge ───────────────────────────────────────────

const nsMeta: Meta<typeof NamespaceBadge> = {
  title:     'Crypto/NamespaceBadge',
  component: NamespaceBadge,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Inline TLP badge resolved from ANS namespace. `.axq/.vrq`→Safe · `.kpx`→Caution · `.sqx/.vpx`→System · raw hex→Blocked.' } },
  },
  tags: ['autodocs'],
};
export default nsMeta;
type Story = StoryObj<typeof NamespaceBadge>;

export const AllLevels: Story = {
  name: 'All TLP Levels',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      <NamespaceBadge name="alice.axq" />
      <NamespaceBadge name="bob.vrq" />
      <NamespaceBadge name="defi-pool.kpx" />
      <NamespaceBadge name="bridge.sqx" />
      <NamespaceBadge name="relay.vpx" />
      <NamespaceBadge name="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" />
    </div>
  ),
};

export const NoLabel: Story = {
  name: 'showLabel=false (dot only)',
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <NamespaceBadge name="alice.axq"   showLabel={false} />
      <NamespaceBadge name="dex.kpx"     showLabel={false} />
      <NamespaceBadge name="0xdeadbeef"  showLabel={false} />
    </div>
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      <NamespaceBadge name="alice.axq" />
      <NamespaceBadge name="defi.kpx" />
      <NamespaceBadge name="0xdeadbeef" />
    </div>
  ),
};

// ─── AddressDisplay ───────────────────────────────────────────
// (exported from same story file for proximity)

export const AddressDisplayStory: Story = {
  name: 'AddressDisplay',
  parameters: {
    docs: { description: { story: 'Resolves ANS name, shows TLP badge, copy button, and ⚠ warning on raw hex.' } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <AddressDisplay address="alice.axq" />
      <AddressDisplay address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" />
      <AddressDisplay address="dex.kpx" />
    </div>
  ),
};
