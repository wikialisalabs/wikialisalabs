import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Avatar } from './Avatar';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Avatar> = {
  title:     'Core / Avatar',
  component: Avatar,
  tags:      ['autodocs'],
  argTypes: {
    size:   { control: 'radio',  options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: ['online', 'offline', 'away', 'busy'] },
    ring:   { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

// ─── Default (initials) ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    name: 'Alice Chen',
    size: 'md',
  },
};

// ─── WithImage ────────────────────────────────────────────────────────────────

export const WithImage: Story = {
  args: {
    src:  'https://i.pravatar.cc/150?img=5',
    alt:  'Sample user',
    name: 'Sample User',
    size: 'md',
  },
};

// ─── WithStatus ───────────────────────────────────────────────────────────────

export const WithStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="Online User"  status="online"  size="md" />
      <Avatar name="Offline User" status="offline" size="md" />
      <Avatar name="Away User"    status="away"    size="md" />
      <Avatar name="Busy User"    status="busy"    size="md" />
    </div>
  ),
};

// ─── AllSizes ─────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="XS Size" size="xs" />
      <Avatar name="SM Size" size="sm" />
      <Avatar name="MD Size" size="md" />
      <Avatar name="LG Size" size="lg" />
      <Avatar name="XL Size" size="xl" />
    </div>
  ),
};

// ─── WithRing ─────────────────────────────────────────────────────────────────

export const WithRing: Story = {
  args: {
    name: 'Ring User',
    size: 'md',
    ring: true,
  },
};

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {[
        { name: 'Alice Chen',   src: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Bob Smith',    src: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Carol Davis',  src: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Dan Wilson',   src: 'https://i.pravatar.cc/150?img=4' },
        { name: 'Eve Martinez', src: 'https://i.pravatar.cc/150?img=5' },
      ].map((user, i) => (
        <div key={user.name} style={{ marginLeft: i === 0 ? 0 : '-8px', zIndex: 5 - i }}>
          <Avatar
            src={user.src}
            name={user.name}
            size="md"
            ring
          />
        </div>
      ))}
    </div>
  ),
};
