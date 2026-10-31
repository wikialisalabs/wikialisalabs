import { forwardRef } from 'react';
import styles from './ProgressBar.module.css';

// ─── ProgressBar ─────────────────────────────────────────────────────────────

export interface ProgressBarProps {
  /** Progress value 0–100 */
  value:      number;
  /** Thin (4px) or default (8px). Default: 'default' */
  size?:      'thin' | 'default';
  /** Show percentage label. Default: false */
  showLabel?: boolean;
  /** aria-label */
  label?:     string;
  className?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(({
  value,
  size      = 'default',
  showLabel = false,
  label     = 'Progress',
  className,
}, ref) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {showLabel && (
        <div className={styles.labelRow}>
          <span className={styles.labelText}>{label}</span>
          <span className={styles.percentText}>{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={styles.track}
        data-size={size}
      >
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

// ─── StepIndicator ───────────────────────────────────────────────────────────

export type StepState = 'done' | 'active' | 'pending';

export interface Step {
  label:  string;
  state?: StepState;
}

export interface StepIndicatorProps {
  steps:       Step[];
  /** 0-based index of the current active step */
  activeStep:  number;
  className?:  string;
}

const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const StepIndicator = forwardRef<HTMLOListElement, StepIndicatorProps>(({
  steps,
  activeStep,
  className,
}, ref) => (
  <ol
    ref={ref}
    className={[styles.steps, className].filter(Boolean).join(' ')}
    aria-label="Progress steps"
  >
    {steps.map((step, i) => {
      const state: StepState = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
      return (
        <li
          key={i}
          className={styles.step}
          data-state={state}
          aria-current={state === 'active' ? 'step' : undefined}
        >
          {/* Connector line (before each step except first) */}
          {i > 0 && <span className={styles.connector} aria-hidden="true" />}
          {/* Circle */}
          <span className={styles.circle} aria-hidden="true">
            {state === 'done' ? <CheckIcon /> : <span>{i + 1}</span>}
          </span>
          {/* Label */}
          <span className={styles.stepLabel}>{step.label}</span>
        </li>
      );
    })}
  </ol>
));

StepIndicator.displayName = 'StepIndicator';
