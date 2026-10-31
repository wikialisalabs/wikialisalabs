import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton, SkeletonListItem, SkeletonCard, SkeletonProfile } from './Skeleton';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Skeleton> = {
  title:     'Core / Skeleton',
  component: Skeleton,
  tags:      ['autodocs'],
  argTypes: {
    variant:   { control: 'radio',  options: ['text', 'circle', 'rect'] },
    animation: { control: 'radio',  options: ['shimmer', 'pulse', 'none'] },
    lines:     { control: 'number' },
    width:     { control: 'text' },
    height:    { control: 'text' },
  },
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

// ─── Text ─────────────────────────────────────────────────────────────────────

export const Text: Story = {
  args: {
    variant:   'text',
    lines:     3,
    animation: 'shimmer',
  },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Skeleton {...args} />
    </div>
  ),
};

// ─── Circle ───────────────────────────────────────────────────────────────────

export const Circle: Story = {
  args: {
    variant: 'circle',
    width:   48,
    height:  48,
  },
};

// ─── Rectangle ───────────────────────────────────────────────────────────────

export const Rectangle: Story = {
  args: {
    variant: 'rect',
    height:  80,
  },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Skeleton {...args} />
    </div>
  ),
};

// ─── PulseAnimation ───────────────────────────────────────────────────────────

export const PulseAnimation: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Skeleton variant="rect"   height={80}  animation="pulse" />
      <Skeleton variant="text"   lines={2}    animation="pulse" />
    </div>
  ),
};

// ─── ListItemPreset ───────────────────────────────────────────────────────────

export const ListItemPreset: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SkeletonListItem />
      <SkeletonListItem />
      <SkeletonListItem />
    </div>
  ),
};

// ─── CardPreset ───────────────────────────────────────────────────────────────

export const CardPreset: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <SkeletonCard />
    </div>
  ),
};

// ─── ProfilePreset ────────────────────────────────────────────────────────────

export const ProfilePreset: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <SkeletonProfile />
    </div>
  ),
};
