import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

// ─── Render ───────────────────────────────────────────────────────────────────

describe('Input — render', () => {
  it('renders a text input by default', () => {
    render(<Input label="Email" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label linked to input', () => {
    render(<Input label="Username" id="username" />);
    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', 'username');
    expect(input).toHaveAttribute('id', 'username');
  });

  it('renders without label', () => {
    render(<Input placeholder="Search…" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders textarea for type=multiline', () => {
    render(<Input type="multiline" label="Note" />);
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('renders helper text', () => {
    render(<Input label="Email" helperText="Enter your work email" />);
    expect(screen.getByText('Enter your work email')).toBeInTheDocument();
  });
});

// ─── Controlled / Uncontrolled ────────────────────────────────────────────────

describe('Input — value', () => {
  it('renders defaultValue as initial value', () => {
    render(<Input label="Name" defaultValue="Alice" />);
    expect(screen.getByRole('textbox')).toHaveValue('Alice');
  });

  it('renders controlled value', () => {
    render(<Input label="Name" value="Bob" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Bob');
  });

  it('updates value on typing (uncontrolled)', async () => {
    render(<Input label="Name" />);
    await userEvent.type(screen.getByRole('textbox'), 'Alice');
    expect(screen.getByRole('textbox')).toHaveValue('Alice');
  });

  it('calls onChange on each keystroke', async () => {
    const onChange = jest.fn();
    render(<Input label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hi');
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});

// ─── Error state ─────────────────────────────────────────────────────────────

describe('Input — error state', () => {
  it('shows error message with role="alert"', () => {
    render(<Input label="Email" errorText="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('sets aria-invalid on input when error', () => {
    render(<Input label="Email" errorText="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('error hides helper text', () => {
    render(<Input label="Email" helperText="Hint" errorText="Error" />);
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
  });
});

// ─── Disabled state ───────────────────────────────────────────────────────────

describe('Input — disabled state', () => {
  it('is disabled when disabled=true', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not trigger onChange when disabled', async () => {
    const onChange = jest.fn();
    render(<Input label="Email" disabled onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'x');
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Password ─────────────────────────────────────────────────────────────────

describe('Input — password type', () => {
  it('renders password input with type=password', () => {
    render(<Input type="password" label="Password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('toggles to text type when show button clicked', async () => {
    render(<Input type="password" label="Password" />);
    const toggle = screen.getByRole('button', { name: /show password/i });
    await userEvent.click(toggle);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  });

  it('toggle button label changes after click', async () => {
    render(<Input type="password" label="Password" />);
    const toggle = screen.getByRole('button', { name: /show password/i });
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
  });
});

// ─── Required ─────────────────────────────────────────────────────────────────

describe('Input — required', () => {
  it('sets aria-required on input when required=true', () => {
    render(<Input label="Email" required />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
  });

  it('renders asterisk visually for required field', () => {
    render(<Input label="Email" required />);
    // The * is aria-hidden, so get by its text content
    expect(screen.getByText(' *')).toHaveAttribute('aria-hidden', 'true');
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Input — accessibility', () => {
  it('error element is linked via aria-describedby', () => {
    render(<Input label="Email" id="em" errorText="Required" />);
    const input   = screen.getByRole('textbox');
    const errorEl = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', errorEl.id);
  });

  it('helper text is linked via aria-describedby', () => {
    render(<Input label="Email" id="em2" helperText="Hint" />);
    const input  = screen.getByRole('textbox');
    const helper = screen.getByText('Hint');
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  it('search input renders clear button when value present', async () => {
    render(<Input type="search" defaultValue="btc" />);
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('clear button removes value', async () => {
    render(<Input type="search" defaultValue="btc" />);
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});
