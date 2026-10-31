import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title:     'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Pill-shaped search input with clear button. role="searchbox", hides native cancel button.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SearchBar>;

function SearchDemo(props?: Partial<React.ComponentProps<typeof SearchBar>>) {
  const [val, setVal] = useState('');
  return (
    <SearchBar
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onClear={() => setVal('')}
      style={{ width: 320 } as React.CSSProperties}
      {...props}
    />
  );
}

export const Default:  Story = { render: () => <SearchDemo /> };
export const WithValue: Story = {
  name: 'With value (shows clear button)',
  render: () => <SearchDemo />,
};
export const Disabled: Story = {
  render: () => <SearchBar value="" disabled placeholder="Tìm kiếm…" style={{ width: 320 } as React.CSSProperties} />,
};
export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => <SearchDemo />,
};
