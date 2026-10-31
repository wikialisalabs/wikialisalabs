import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Tooltip> = {
  title:     'Core / Tooltip',
  component: Tooltip,
  tags:      ['autodocs'],
  argTypes: {
    placement: { control: 'radio',   options: ['top', 'bottom', 'left', 'right'] },
    delay:     { control: 'number' },
    disabled:  { control: 'boolean' },
    content:   { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

// ─── Default (top) ────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    content:   'This is a tooltip',
    placement: 'top',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

// ─── AllPlacements ────────────────────────────────────────────────────────────

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '60px' }}>
      <Tooltip content="Top tooltip" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

// ─── LongContent ─────────────────────────────────────────────────────────────

export const LongContent: Story = {
  render: () => (
    <div style={{ padding: '80px' }}>
      <Tooltip
        content="This is a longer tooltip message that spans multiple lines because it contains more text than the max width allows."
        placement="top"
      >
        <Button>Long tooltip</Button>
      </Tooltip>
    </div>
  ),
};

// ─── OnIconButton ─────────────────────────────────────────────────────────────

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="18"
    height="18"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8"  x2="12.01" y2="8" />
  </svg>
);

export const OnIconButton: Story = {
  render: () => (
    <div style={{ padding: '60px' }}>
      <Tooltip content="More information" placement="right">
        <Button iconOnly aria-label="More information">
          <InfoIcon />
        </Button>
      </Tooltip>
    </div>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <Tooltip content="You cannot see me" placement="top" disabled>
      <Button>Tooltip disabled</Button>
    </Tooltip>
  ),
};
