import React from 'react';
import { render, screen } from '@testing-library/react';
import { NamespaceBadge } from './NamespaceBadge';
import { resolveTLPLevel } from '../../types/tlp';

// ─── resolveTLPLevel unit tests ───────────────────────────────

describe('resolveTLPLevel', () => {
  it.each([
    ['alice.axq',    'safe'],
    ['bob.vrq',      'safe'],
    ['ALICE.AXQ',    'safe'],   // case-insensitive
    ['charlie.kpx',  'caution'],
    ['internal.sqx', 'system'],
    ['relay.vpx',    'system'],
    ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'blocked'],
    ['unknown.xyz',  'blocked'],
    ['',             'blocked'],
    ['random',       'blocked'],
  ] as const)('"%s" → %s', (name, expected) => {
    expect(resolveTLPLevel(name)).toBe(expected);
  });
});

// ─── NamespaceBadge tests ─────────────────────────────────────

describe('NamespaceBadge', () => {
  it('renders badge with aria-label', () => {
    render(<NamespaceBadge name="alice.axq" />);
    const badge = screen.getByLabelText(/alice\.axq/i);
    expect(badge).toBeInTheDocument();
  });

  it.each([
    ['alice.axq',   'safe'],
    ['bob.kpx',     'caution'],
    ['0xdeadbeef',  'blocked'],
    ['sys.vpx',     'system'],
  ] as const)('"%s" gets data-tlp="%s"', (name, level) => {
    render(<NamespaceBadge name={name} />);
    expect(screen.getByLabelText(new RegExp(name, 'i'))).toHaveAttribute('data-tlp', level);
  });

  it('shows TLP label text', () => {
    render(<NamespaceBadge name="alice.axq" />);
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('shows name when showLabel=true (default)', () => {
    render(<NamespaceBadge name="alice.axq" />);
    expect(screen.getByText('alice.axq')).toBeInTheDocument();
  });

  it('hides name when showLabel=false', () => {
    render(<NamespaceBadge name="alice.axq" showLabel={false} />);
    expect(screen.queryByText('alice.axq')).not.toBeInTheDocument();
    // But badge still present
    expect(screen.getByLabelText(/alice\.axq/i)).toBeInTheDocument();
  });
});
