import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

// ─── Render ───────────────────────────────────────────────────────────────────

describe('Button — render', () => {
  it('renders children text', () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('renders with type="button" by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

// ─── Variants & sizes ────────────────────────────────────────────────────────

describe('Button — variants & sizes', () => {
  it.each(['filled', 'outlined', 'ghost'] as const)('applies variant class: %s', (variant) => {
    const { container } = render(<Button variant={variant}>X</Button>);
    expect(container.firstChild).toHaveClass(`variant-${variant}`);
  });

  it.each(['giant', 'large', 'medium', 'small'] as const)('applies size class: %s', (size) => {
    const { container } = render(<Button size={size}>X</Button>);
    expect(container.firstChild).toHaveClass(`size-${size}`);
  });

  it.each(['black', 'blue', 'green', 'yellow', 'orange', 'error', 'navy', 'white'] as const)(
    'applies color class: %s', (color) => {
      const { container } = render(<Button color={color}>X</Button>);
      expect(container.firstChild).toHaveClass(`color-${color}`);
    }
  );
});

// ─── Disabled ────────────────────────────────────────────────────────────────

describe('Button — disabled state', () => {
  it('is disabled when disabled=true', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has aria-disabled when disabled', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ─── Loading ─────────────────────────────────────────────────────────────────

describe('Button — loading state', () => {
  it('has aria-busy when loading', () => {
    render(<Button loading>X</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('is disabled when loading', () => {
    render(<Button loading>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when loading', async () => {
    const onClick = jest.fn();
    render(<Button loading onClick={onClick}>Send</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders spinner SVG when loading', () => {
    const { container } = render(<Button loading>Send</Button>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

// ─── Icon positions ───────────────────────────────────────────────────────────

describe('Button — icon positions', () => {
  it('renders iconLeft', () => {
    render(<Button iconLeft={<span data-testid="icon-l" />}>Label</Button>);
    expect(screen.getByTestId('icon-l')).toBeInTheDocument();
  });

  it('renders iconRight', () => {
    render(<Button iconRight={<span data-testid="icon-r" />}>Label</Button>);
    expect(screen.getByTestId('icon-r')).toBeInTheDocument();
  });

  it('iconOnly button renders children without label span', () => {
    render(<Button iconOnly aria-label="Add"><span data-testid="ico" /></Button>);
    expect(screen.getByTestId('ico')).toBeInTheDocument();
    // The accessible name comes from aria-label, not children text
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Button — accessibility', () => {
  it('fullWidth applies fullWidth class', () => {
    const { container } = render(<Button fullWidth>X</Button>);
    expect(container.firstChild).toHaveClass('fullWidth');
  });

  it('is keyboard-activatable via Enter', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Press</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard-activatable via Space', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Press</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick exactly once on click', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
