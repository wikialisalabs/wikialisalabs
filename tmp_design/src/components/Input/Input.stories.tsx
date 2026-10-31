import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from './Input';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Input> = {
  title:     'Core / Input',
  component: Input,
  tags:      ['autodocs'],
  argTypes: {
    type:       { control: 'select', options: ['text', 'password', 'search', 'number', 'email', 'tel', 'multiline', 'readonly'] },
    size:       { control: 'radio',  options: ['large', 'medium', 'small'] },
    label:      { control: 'text' },
    placeholder:{ control: 'text' },
    helperText: { control: 'text' },
    errorText:  { control: 'text' },
    disabled:   { control: 'boolean' },
    required:   { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
    <circle cx="17" cy="12" r="1"/>
  </svg>
);

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label:       'Email',
    placeholder: 'Enter your email',
    type:        'text',
    size:        'medium',
  },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

// ─── All Sizes ────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Input label="Large (56px)" placeholder="Large input" size="large" />
      <Input label="Medium (48px)" placeholder="Medium input" size="medium" />
      <Input label="Small (40px)" placeholder="Small input" size="small" />
    </div>
  ),
};

// ─── All States ───────────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Input label="Default"  placeholder="Placeholder text" />
      <Input label="Filled"   defaultValue="alice.axq" />
      <Input label="Error"    defaultValue="invalid@" errorText="Please enter a valid email address" />
      <Input label="Disabled" placeholder="Cannot edit" disabled />
      <Input label="Helper text" placeholder="Focus me" helperText="This is a helpful hint" />
    </div>
  ),
};

// ─── Password ─────────────────────────────────────────────────────────────────

export const Password: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Input
        type="password"
        label="PIN / Password"
        placeholder="Enter your password"
      />
    </div>
  ),
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const Search: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Input
        type="search"
        placeholder="Search tokens..."
      />
    </div>
  ),
};

// ─── With Icons ───────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Input
        label="Recipient"
        placeholder="alice.axq or 0x…"
        iconLeft={<WalletIcon />}
        helperText="ANS name or raw 0x address"
      />
    </div>
  ),
};

// ─── Multiline ────────────────────────────────────────────────────────────────

export const Multiline: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Input
        type="multiline"
        label="Transaction memo"
        placeholder="Optional note..."
        rows={4}
        helperText="Max 200 characters"
        maxLength={200}
      />
    </div>
  ),
};

// ─── Required ─────────────────────────────────────────────────────────────────

export const RequiredField: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Input
        label="Email"
        placeholder="required@example.com"
        required
        helperText="We'll never share your email"
      />
    </div>
  ),
};

// ─── A11y audit ───────────────────────────────────────────────────────────────

export const A11yAudit: Story = {
  name: 'A11y — Label + Error Alert',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Input
        label="Email address"
        placeholder="Enter email"
        required
        errorText="This field is required"
      />
    </div>
  ),
  parameters: {
    a11y: { config: { rules: [{ id: 'label', enabled: true }, { id: 'aria-required-attr', enabled: true }] } },
  },
};
