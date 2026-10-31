import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PasskeyButton } from './PasskeyButton';

const meta: Meta<typeof PasskeyButton> = {
  title:     'Crypto/PasskeyButton',
  component: PasskeyButton,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'WebAuthn passkey — register or authenticate. Shows unsupported fallback when browser lacks WebAuthn. Challenge from server required.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PasskeyButton>;

// Mock challenge (base64url encoded 32 bytes)
const MOCK_CHALLENGE = 'Y2hhbGxlbmdlX2J5dGVzX2hlcmVfMzI=';

export const Register: Story = {
  render: () => (
    <PasskeyButton
      action="register"
      challenge={MOCK_CHALLENGE}
      userName="alice"
      userId="YWxpY2U="
      onSuccess={(cred) => console.log('registered:', cred.id)}
      onError={(msg) => alert('Error: ' + msg)}
    />
  ),
};

export const Authenticate: Story = {
  render: () => (
    <PasskeyButton
      action="authenticate"
      challenge={MOCK_CHALLENGE}
      onSuccess={(cred) => console.log('authenticated:', cred.id)}
      onError={(msg) => alert('Error: ' + msg)}
    />
  ),
};

export const CustomLabel: Story = {
  name: 'Custom label',
  render: () => (
    <PasskeyButton
      action="authenticate"
      challenge={MOCK_CHALLENGE}
      label="Xác nhận bằng Face ID"
      onSuccess={() => {}}
    />
  ),
};

export const DisabledState: Story = {
  name: 'Disabled',
  render: () => (
    <PasskeyButton
      action="authenticate"
      challenge={MOCK_CHALLENGE}
      disabled
      onSuccess={() => {}}
    />
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => (
    <PasskeyButton action="authenticate" challenge={MOCK_CHALLENGE} onSuccess={() => {}} />
  ),
};
