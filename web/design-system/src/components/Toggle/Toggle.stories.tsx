import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title:     'Core / Toggle',
  component: Toggle,
  tags:      ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { 'aria-label': 'Toggle feature' },
};

export const WithLabel: Story = {
  args: { label: 'Dark mode', defaultChecked: false },
};

export const On: Story = {
  args: { label: 'Notifications', defaultChecked: true },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle label="Disabled off" disabled />
      <Toggle label="Disabled on"  disabled defaultChecked />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Toggle label="Medium (default)" size="medium" />
      <Toggle label="Small"            size="small" />
    </div>
  ),
};

export const LabelLeft: Story = {
  args: { label: 'Label on left', labelPosition: 'left', defaultChecked: true },
};

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <Toggle label={`Feature is ${on ? 'ON' : 'OFF'}`} checked={on} onChange={setOn} />
        <button
          style={{ fontSize: 12, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setOn((v) => !v)}
        >
          Toggle externally
        </button>
      </div>
    );
  },
};
