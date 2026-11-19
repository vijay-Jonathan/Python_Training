import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { renderIcon, type IconLike } from "./icon";

/**
 * What every field control adds to its native element.
 *
 * `icon` is here because the form controls were the only components in the
 * system that could not carry a mark, while ten others could — and a search
 * box with a leading magnifier is the single most common input anyone writes.
 * `<Input icon={Search} placeholder="Search orders" />` was a compile error
 * and a spent repair cycle. The rule the whole design system now keeps is that
 * a component either accepts `icon` or has no text to put a mark beside; a
 * labelled text field plainly has one.
 */
interface FieldShell {
  label?: ReactNode;
  hint?: ReactNode;
  /** Present means invalid: the control is marked and the message is shown. */
  error?: string | null;
  /** A mark inside the control, before the text — a lucide component or an element. */
  icon?: IconLike;
  /** A mark inside the control, after the text — a unit, a status, a clear. */
  iconRight?: IconLike;
}

/** Which control is wrapped, so the marks can be placed to suit it. */
type Variant = "input" | "textarea" | "select";

function Shell({
  label,
  hint,
  error,
  icon,
  iconRight,
  id,
  variant,
  children,
}: FieldShell & { id: string; variant: Variant; children: ReactNode }) {
  // The positioning wrapper only exists when something needs positioning
  // against. Without it the control stays a direct child of `.field`, which is
  // what `.input-group` and `.search` in components.css already style.
  const marked = Boolean(icon) || Boolean(iconRight);

  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      {marked ? (
        <div className={`field-control field-control-${variant}`}>
          {icon ? <span className="field-affix">{renderIcon(icon)}</span> : null}
          {children}
          {iconRight ? (
            <span className="field-affix field-affix-end">{renderIcon(iconRight)}</span>
          ) : null}
        </div>
      ) : (
        children
      )}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/** The control's own classes plus the padding its marks need. */
function controlClass(
  base: string,
  icon: IconLike,
  iconRight: IconLike,
  className: string,
): string {
  return [base, icon ? "has-affix" : "", iconRight ? "has-affix-end" : "", className]
    .filter(Boolean)
    .join(" ");
}

export type InputProps = FieldShell & InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  hint,
  error,
  icon,
  iconRight,
  className = "",
  id,
  ...rest
}: InputProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <Shell
      label={label}
      hint={hint}
      error={error}
      icon={icon}
      iconRight={iconRight}
      id={fieldId}
      variant="input"
    >
      <input
        id={fieldId}
        className={controlClass("input", icon, iconRight, className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Shell>
  );
}

export type TextareaProps = FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  label,
  hint,
  error,
  icon,
  iconRight,
  className = "",
  id,
  ...rest
}: TextareaProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <Shell
      label={label}
      hint={hint}
      error={error}
      icon={icon}
      iconRight={iconRight}
      id={fieldId}
      variant="textarea"
    >
      <textarea
        id={fieldId}
        className={controlClass("textarea", icon, iconRight, className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Shell>
  );
}

/**
 * `children` is optional, like everywhere else in this system.
 *
 * It was required, which made `<Select value={v} onChange={set} />` with the
 * options mapped in afterwards a "Property 'children' is missing" error. A
 * select with no options is an empty select, not a compile error.
 */
export type SelectProps = FieldShell &
  SelectHTMLAttributes<HTMLSelectElement> & { children?: ReactNode };

export function Select({
  label,
  hint,
  error,
  icon,
  iconRight,
  className = "",
  id,
  children,
  ...rest
}: SelectProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <Shell
      label={label}
      hint={hint}
      error={error}
      icon={icon}
      iconRight={iconRight}
      id={fieldId}
      variant="select"
    >
      <select
        id={fieldId}
        className={controlClass("select", icon, iconRight, className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {children}
      </select>
    </Shell>
  );
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Optional: a checkbox in a table column selects its row and is labelled by
   * the column, not by itself. Requiring a label made that a compile error.
   */
  label?: ReactNode;
  /** A mark before the label — a lucide component or an element. */
  icon?: IconLike;
  /** Accepted as a synonym for `label`, since `<Checkbox>Yes</Checkbox>` reads. */
  children?: ReactNode;
}

export function Checkbox({ label, icon, children, className = "", ...rest }: CheckboxProps) {
  const text = label ?? children;
  return (
    <label className={`checkbox ${className}`.trim()}>
      <input type="checkbox" {...rest} />
      {icon ? renderIcon(icon, 14) : null}
      {text !== undefined && text !== null && <span>{text}</span>}
    </label>
  );
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  label?: ReactNode;
  icon?: IconLike;
}

/** The binary preference — a Checkbox wearing its state. */
export function Switch({ label, icon, className = "", children, ...rest }: SwitchProps) {
  return (
    <label className={`switch ${className}`.trim()}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="switch-track" aria-hidden="true" />
      {icon ? renderIcon(icon) : null}
      {label ?? children ? <span>{label ?? children}</span> : null}
    </label>
  );
}
