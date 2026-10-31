import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle — render', () => {
  it('renders with role="switch"', () => {
    render(<Toggle aria-label="Notifications" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('is off by default', () => {
    render(<Toggle aria-label="Test" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('renders label when provided', () => {
    render(<Toggle label="Dark mode" />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('does not render label element when no label prop', () => {
    render(<Toggle aria-label="test" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });
});

describe('Toggle — uncontrolled', () => {
  it('toggles on click', async () => {
    render(<Toggle aria-label="toggle" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange with new value', async () => {
    const onChange = jest.fn();
    render(<Toggle aria-label="toggle" onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('starts checked when defaultChecked=true', () => {
    render(<Toggle aria-label="toggle" defaultChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Toggle — controlled', () => {
  it('reflects checked prop', () => {
    render(<Toggle aria-label="toggle" checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicked (controlled)', async () => {
    const onChange = jest.fn();
    render(<Toggle aria-label="toggle" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('Toggle — disabled', () => {
  it('is disabled when disabled=true', () => {
    render(<Toggle aria-label="toggle" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const onChange = jest.fn();
    render(<Toggle aria-label="toggle" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Toggle — keyboard', () => {
  it('Space key toggles', async () => {
    render(<Toggle aria-label="toggle" />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('Enter key does NOT toggle (ARIA switch spec)', async () => {
    render(<Toggle aria-label="toggle" />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard('{Enter}');
    // Still false — Enter does not activate a switch
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Toggle — accessibility', () => {
  it('uses aria-label when no visible label', () => {
    render(<Toggle aria-label="Enable dark mode" />);
    expect(screen.getByRole('switch', { name: 'Enable dark mode' })).toBeInTheDocument();
  });

  it('uses aria-labelledby pointing to label element', () => {
    render(<Toggle label="Notifications" id="notif-toggle" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-labelledby', 'notif-toggle-label');
  });
});
