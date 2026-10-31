/**
 * CSS Modules type declaration.
 * Allows TypeScript to resolve `import styles from '*.module.css'` imports.
 * The Vite build handles the actual CSS processing at runtime.
 */
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
