import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { OTPInput } from './OTPInput';

const meta: Meta<typeof OTPInput> = {
  title:     'Components/OTPInput',
  component: OTPInput,
  parameters: {
    layout: 'centered',
    docs: { description: { component: '4- or 6-digit one-time-password input. Auto-advances focus, supports paste, keyboard navigation, and 3 visual states.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof OTPInput>;

function OTPDemo(props: Partial<React.ComponentProps<typeof OTPInput>>) {
  const [val, setVal] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <OTPInput value={val} onChange={setVal} onComplete={(v) => console.log('complete:', v)} {...props} />
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Value: "{val}"</span>
    </div>
  );
}

export const Default: Story = { render: () => <OTPDemo /> };

export const FourDigits: Story = {
  name: '4 Digits',
  render: () => <OTPDemo digits={4} />,
};

export const ErrorState: Story = {
  render: () => <OTPDemo state="error" helperText="Mã không đúng. Còn 2 lần thử." />,
};

export const SuccessState: Story = {
  render: () => <OTPDemo digits={6} value="123456" state="success" helperText="Xác thực thành công!" />,
};

export const Disabled: Story = {
  render: () => <OTPInput digits={6} value="123" disabled />,
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => <OTPDemo />,
};
