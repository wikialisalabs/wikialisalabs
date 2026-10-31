import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProgressBar, StepIndicator, type Step } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title:     'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Linear `ProgressBar` with smooth CSS fill transition. `StepIndicator` for multi-step onboarding/KYC flows.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

// ─── ProgressBar ──────────────────────────────────────────────

export const Default: Story = {
  args: { value: 60, showLabel: true, label: 'Đang tải…' },
};

export const Thin: Story = {
  args: { value: 35, size: 'thin', showLabel: false },
};

export const AllValues: Story = {
  name: 'All Values',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 400 }}>
      {[0, 25, 50, 75, 100].map((v) => (
        <ProgressBar key={v} value={v} showLabel label={`${v}%`} />
      ))}
    </div>
  ),
};

// ─── StepIndicator ────────────────────────────────────────────

const KYC_STEPS: Step[] = [
  { label: 'Tài khoản' },
  { label: 'Xác minh' },
  { label: 'KYC' },
  { label: 'Passkey' },
  { label: 'Hoàn tất' },
];

export const StepsDone2: Story = {
  name: 'StepIndicator — step 3 active',
  render: () => <StepIndicator steps={KYC_STEPS} activeStep={2} />,
};

export const StepsComplete: Story = {
  name: 'StepIndicator — all done',
  render: () => <StepIndicator steps={KYC_STEPS} activeStep={5} />,
};

export const StepsDark: Story = {
  name: 'StepIndicator — Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => <StepIndicator steps={KYC_STEPS} activeStep={2} />,
};
