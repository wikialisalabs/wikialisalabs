/**
 * @axioledger/axio-design-system
 *
 * AXQ Design System — React component library.
 * MIT License © Axioledger Engineering
 *
 * Usage:
 *   import { Button, Input } from '@axioledger/axio-design-system';
 *   import '@axioledger/axio-design-system/styles';
 *
 * Tree-shaking note:
 *   All exports are named. Import only the components you use
 *   and your bundler will eliminate the rest.
 */

// ─── Styles (side-effect import in consuming app) ───────────────────────────
// import '@axioledger/axio-design-system/styles';

// ─── Provider ────────────────────────────────────────────────────────────────
export { AxioProvider } from './providers/AxioProvider';

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useTheme }       from './hooks/useTheme';
export { useANSResolver } from './hooks/useANSResolver';
export { useToast }       from './hooks/useToast';

// ─── Core Components ─────────────────────────────────────────────────────────
export { Button }                     from './components/Button/Button';
export { Input }                      from './components/Input/Input';
export { Card }                       from './components/Card/Card';
export { Badge, Chip }                from './components/Badge/Badge';
export { Toggle }                     from './components/Toggle/Toggle';
export { Avatar }                     from './components/Avatar/Avatar';
export { Modal }                      from './components/Modal/Modal';
export { BottomSheet }                from './components/Modal/BottomSheet';
export { Toast, ToastContainer }      from './components/Toast/Toast';
export { Tooltip }                    from './components/Tooltip/Tooltip';
export { Navbar }                     from './components/Navbar/Navbar';
export { Skeleton }                   from './components/Skeleton/Skeleton';

// ─── Form Components ─────────────────────────────────────────────────────────
export { OTPInput }                   from './components/OTPInput/OTPInput';
export { Checkbox, RadioButton }      from './components/Checkbox/Checkbox';
export { Dropdown }                   from './components/Dropdown/Dropdown';
export { SearchBar }                  from './components/SearchBar/SearchBar';
// DatePicker — Phase 3

// ─── Feedback Components ─────────────────────────────────────────────────────
export { Alert, SecurityAlert }       from './components/Alert/Alert';
export { EmptyState }                 from './components/EmptyState/EmptyState';
export { ProgressBar, StepIndicator } from './components/ProgressBar/ProgressBar';

// ─── Crypto-specific Components ──────────────────────────────────────────────
export { NamespaceBadge }             from './components/crypto/NamespaceBadge';
export { AddressDisplay }             from './components/crypto/AddressDisplay';
export { PasskeyButton }              from './components/crypto/PasskeyButton';
export { CryptoAssetCard }            from './components/crypto/CryptoAssetCard';
export { QRCodeDisplay }              from './components/crypto/QRCodeDisplay';
export { TransactionItem }            from './components/crypto/TransactionItem';
export { BalanceDisplay }             from './components/crypto/BalanceDisplay';
export { PriceTicker }                from './components/crypto/PriceTicker';

// ─── Types ───────────────────────────────────────────────────────────────────
export type { TLPLevel, TLPConfig, ANSResolverConfig, ThemeMode } from './types';
export {      TLP_MAP, resolveTLPLevel }                           from './types';
export type { Step, StepState }                                    from './components/ProgressBar/ProgressBar';
export type { QuickAction }                                        from './components/crypto/BalanceDisplay';

// ─── Token constants (JS/TS access to 3-layer token system) ──────────────────
export {
  PRIMITIVE_TOKENS,
  SEMANTIC_TOKENS,
  COMPONENT_TOKENS,
  TLP_TOKENS,
  TLP_CSS_VARS,
  TLD_TLP_MAP,
  resolveTLP,
  COLOR,
  FONT,
  RADIUS,
  BTN_HEIGHT,
  GRADIENT,
  SHADOW,
  TABLE_TOKENS,
  TOAST_TOKENS,
  DRAWER_TOKENS,
} from './tokens';
export type {
  CSSVar,
  ColorHex,
  TokenLayer,
  PrimitiveColorScale,
  PrimitiveStatusColors,
  PrimitiveBrandColors,
  PrimitiveFontSizes,
  PrimitiveFontWeights,
  PrimitiveRadiusScale,
  SemanticColorGroup,
  SemanticStatusGroup,
  SemanticTokenMap,
  ButtonTokens,
  InputTokens,
} from './tokens';

// ─── Icon system ──────────────────────────────────────────────────────────────
export { Icon }                                from './components/Icon/Icon';
export type { IconProps }                      from './components/Icon/Icon';
export type { IconName, LinearIconName, BoldIconName } from './components/Icon/icon.types';
export { ALL_ICON_NAMES, LINEAR_ICON_NAMES, BOLD_ICON_NAMES } from './components/Icon/icon.types';
