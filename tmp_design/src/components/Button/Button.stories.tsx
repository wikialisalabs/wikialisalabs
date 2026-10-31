import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './Button';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title:     'Core / Button',
  component: Button,
  tags:      ['autodocs'],
  argTypes: {
    variant:   { control: 'radio',  options: ['filled', 'outlined', 'ghost'] },
    color:     { control: 'select', options: ['black', 'blue', 'green', 'yellow', 'orange', 'error', 'navy', 'white'] },
    size:      { control: 'radio',  options: ['giant', 'large', 'medium', 'small'] },
    loading:   { control: 'boolean' },
    disabled:  { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconOnly:  { control: 'boolean' },
    children:  { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Button',
    variant:  'filled',
    color:    'blue',
    size:     'medium',
  },
};

// ─── All Variants ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="filled"   color="blue">Filled</Button>
      <Button variant="outlined" color="blue">Outlined</Button>
      <Button variant="ghost"    color="blue">Ghost</Button>
    </div>
  ),
};

// ─── All Colors ───────────────────────────────────────────────────────────────

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Button color="black">Black</Button>
      <Button color="blue">Blue</Button>
      <Button color="green">Green</Button>
      <Button color="yellow">Yellow</Button>
      <Button color="orange">Orange</Button>
      <Button color="error">Error</Button>
      <Button color="navy">Navy</Button>
      <div style={{ background: '#1E2A59', padding: '4px 8px', borderRadius: '8px' }}>
        <Button color="white">White</Button>
      </div>
    </div>
  ),
};

// ─── All Sizes ────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="giant">Giant (56px)</Button>
      <Button size="large">Large (48px)</Button>
      <Button size="medium">Medium (40px)</Button>
      <Button size="small">Small (32px)</Button>
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};

// ─── With Icons ───────────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button iconLeft={<PlusIcon />}>Icon Left</Button>
      <Button iconRight={<ArrowIcon />}>Icon Right</Button>
      <Button iconOnly aria-label="Add item"><PlusIcon /></Button>
    </div>
  ),
};

// ─── Full Width ───────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Button fullWidth>Full Width CTA</Button>
    </div>
  ),
};

// ─── Outlined Matrix ─────────────────────────────────────────────────────────

export const OutlinedMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {(['black','blue','green','yellow','orange','error','navy'] as const).map((color) => (
        <Button key={color} variant="outlined" color={color}>
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

// ─── A11y — contrast audit ────────────────────────────────────────────────────

export const ContrastAudit: Story = {
  name: 'A11y — Contrast Audit',
  render: () => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '16px', background: '#FFFFFF', borderRadius: '12px' }}>
      <Button color="green">Green (dark text ✓)</Button>
      <Button color="yellow">Yellow (dark text ✓)</Button>
      <Button color="blue">Blue (white text ✓)</Button>
      <Button color="error">Error (white text ✓)</Button>
    </div>
  ),
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
  },
};
