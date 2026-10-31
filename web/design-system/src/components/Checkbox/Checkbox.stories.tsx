import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Checkbox, RadioButton } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title:     'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Checkbox (5 states incl. indeterminate) and RadioButton — accessible, keyboard-navigable.' } },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const AllCheckboxStates: Story = {
  name: 'Checkbox — All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Error state" error helperText="Vui lòng đồng ý điều khoản" />
    </div>
  ),
};

export const CheckboxWithHelper: Story = {
  name: 'Checkbox with helper text',
  render: () => (
    <Checkbox
      label="Tôi đồng ý với điều khoản dịch vụ"
      helperText="Đọc kỹ trước khi đồng ý"
      defaultChecked
    />
  ),
};

export const AllRadioStates: Story = {
  name: 'RadioButton — All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioButton label="Unselected" name="demo" value="a" />
      <RadioButton label="Selected" name="demo" value="b" defaultChecked />
      <RadioButton label="Disabled" name="demo" value="c" disabled />
      <RadioButton label="Error" name="demo" value="d" error helperText="Vui lòng chọn một tuỳ chọn" />
    </div>
  ),
};

export const RadioGroup: Story = {
  name: 'RadioButton — Group',
  render: () => (
    <fieldset style={{ border: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <legend style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
        Chọn mạng blockchain
      </legend>
      <RadioButton label="Axioledger (AXQ)" name="network" value="axq" defaultChecked />
      <RadioButton label="KPX Network"      name="network" value="kpx" />
      <RadioButton label="VRQ Chain"        name="network" value="vrq" />
    </fieldset>
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { globals: { theme: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Checkbox dark" defaultChecked />
      <RadioButton label="Radio dark" defaultChecked />
    </div>
  ),
};
