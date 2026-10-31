import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Chip } from './Badge';

const meta: Meta = {
  title:     'Core / Badge & Chip',
  tags:      ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const AllBadgeVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="default">Default</Badge>
    </div>
  ),
};

export const DotBadges: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge dot variant="info"    />
      <Badge dot variant="success" />
      <Badge dot variant="warning" />
      <Badge dot variant="error"   />
      <Badge dot variant="default" />
    </div>
  ),
};

export const ChipDefault: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip>All</Chip>
      <Chip>Bitcoin</Chip>
      <Chip>Ethereum</Chip>
    </div>
  ),
};

export const ChipActive: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip active>Active</Chip>
      <Chip>Inactive</Chip>
    </div>
  ),
};

export const ChipRemovable: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip removable onRemove={() => {}}>Bitcoin</Chip>
      <Chip removable active onRemove={() => {}}>Ethereum</Chip>
    </div>
  ),
};

export const ChipGroup: StoryObj = {
  render: () => {
    const [active, setActive] = React.useState('All');
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['All', 'BTC', 'ETH', 'SOL', 'AXQ'].map((label) => (
          <Chip
            key={label}
            active={active === label}
            onClick={() => setActive(label)}
          >
            {label}
          </Chip>
        ))}
      </div>
    );
  },
};

export const ChipDisabled: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip disabled>Disabled</Chip>
      <Chip disabled active>Disabled Active</Chip>
    </div>
  ),
};
