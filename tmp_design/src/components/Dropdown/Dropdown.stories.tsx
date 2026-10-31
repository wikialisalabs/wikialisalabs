import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dropdown, type DropdownOption } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title:     'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Single and multi-select dropdown. ARIA combobox/listbox pattern. Outside-click and Escape-to-close.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

const NETWORKS: DropdownOption[] = [
  { value: 'axq',  label: 'Axioledger (AXQ)' },
  { value: 'kpx',  label: 'KPX Network' },
  { value: 'vrq',  label: 'VRQ Chain' },
  { value: 'sqx',  label: 'SQX Ledger', disabled: true },
];

const TOKENS: DropdownOption[] = [
  { value: 'btc', label: 'Bitcoin (BTC)'  },
  { value: 'eth', label: 'Ethereum (ETH)' },
  { value: 'axq', label: 'AXQ Token'      },
  { value: 'kpx', label: 'KPX Token'      },
  { value: 'usdt',label: 'USDT'           },
];

function SingleDemo() {
  const [val, setVal] = useState('');
  return <Dropdown label="Select network" options={NETWORKS} value={val} onChange={setVal} placeholder="Choose…" style={{ width: 260 } as React.CSSProperties} />;
}

function MultiDemo() {
  const [vals, setVals] = useState<string[]>([]);
  return <Dropdown label="Select tokens" options={TOKENS} values={vals} multiple onChangeMulti={setVals} placeholder="Choose tokens…" style={{ width: 260 } as React.CSSProperties} />;
}

export const SingleSelect: Story = { render: () => <SingleDemo /> };
export const MultiSelect:  Story = { name: 'Multi-select', render: () => <MultiDemo /> };

export const ErrorState: Story = {
  render: () => (
    <Dropdown
      label="Network"
      options={NETWORKS}
      error
      helperText="Vui lòng chọn mạng"
      placeholder="Chưa chọn"
      style={{ width: 260 } as React.CSSProperties}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Dropdown
      label="Disabled"
      options={NETWORKS}
      value="axq"
      disabled
      style={{ width: 260 } as React.CSSProperties}
    />
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => <SingleDemo />,
};
