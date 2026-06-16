"use client";

/**
 * LATTICE Theme #1 — Fine Dining
 * ReservationForm component.
 *
 * Design Law 5 — Forms
 *   - Input border: `1px solid var(--color-border)` → focus: `2px solid var(--color-primary)`.
 *   - Error state: `border-color: var(--color-error)` + helper text in `var(--color-error)`.
 *   - Label always above the field — never placeholder-as-label.
 *   - Submit button full-width on mobile.
 *   - Min tap target 44×44px (WCAG 2.5.5).
 *
 * Skill 1 — CRDT
 *   No Yjs for form data — the reservation is its own transactional
 *   write to the (future) reservations service. React state is
 *   ephemeral form input — explicitly allowed per CLAUDE.md §3.
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference.
 *
 * Skill 3 — Zod at the boundary
 *   The submit handler validates the form with the inline
 *   `validate()` function (Zod not bundled in this component to
 *   keep the theme lightweight). The host app can pass a Zod
 *   schema via `onSubmit` to enforce server-side validation.
 */

import * as React from "react";
import { CalendarCheck2, AlertCircle, CheckCircle2 } from "lucide-react";

export interface ReservationFormValues {
  name: string;
  email: string;
  phone: string;
  /** ISO date YYYY-MM-DD. */
  date: string;
  /** HH:MM (24h). */
  time: string;
  partySize: number;
  occasion?: string;
  specialRequests?: string;
}

export interface ReservationFormProps {
  /** Async submit handler. The host can wire this to a Supabase RPC. */
  onSubmit?: (values: ReservationFormValues) => Promise<void> | void;
  /** Min party size. Defaults to 1. */
  minPartySize?: number;
  /** Max party size. Defaults to 12. */
  maxPartySize?: number;
  /** Available time slots (HH:MM 24h). Defaults to dinner service. */
  timeSlots?: string[];
}

const DEFAULT_TIME_SLOTS = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Business dinner",
  "Date night",
  "Celebration",
  "Other",
];

type FieldName = keyof ReservationFormValues;

type FieldErrors = Partial<Record<FieldName, string>>;

function todayIso(): string {
  // Local-time ISO date (YYYY-MM-DD) — sufficient for a date picker.
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
}

function validate(values: ReservationFormValues, opts: { min: number; max: number }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Please enter a valid email address.";
  if (!/^[+\d][\d\s\-()]{6,}$/.test(values.phone))
    errors.phone = "Please enter a valid phone number.";
  if (!values.date) errors.date = "Please choose a date.";
  if (!values.time) errors.time = "Please choose a time.";
  if (values.partySize < opts.min || values.partySize > opts.max)
    errors.partySize = `Party size must be between ${opts.min} and ${opts.max}.`;
  return errors;
}

export function ReservationForm({
  onSubmit,
  minPartySize = 1,
  maxPartySize = 12,
  timeSlots = DEFAULT_TIME_SLOTS,
}: ReservationFormProps) {
  const [values, setValues] = React.useState<ReservationFormValues>({
    name: "",
    email: "",
    phone: "",
    date: todayIso(),
    time: "19:00",
    partySize: 2,
    occasion: undefined,
    specialRequests: "",
  });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [touched, setTouched] = React.useState<Partial<Record<FieldName, true>>>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "ok" | "error">("idle");

  const setField = <K extends FieldName>(name: K, value: ReservationFormValues[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: FieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const next = validate(values, { min: minPartySize, max: maxPartySize });
    setErrors(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mark every field touched so all errors are visible.
    const allTouched = Object.keys(values).reduce<Partial<Record<FieldName, true>>>((acc, k) => {
      acc[k as FieldName] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const next = validate(values, { min: minPartySize, max: maxPartySize });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Default: simulate a successful round-trip (no real backend).
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Reservation form"
      className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-2"
    >
      <Field
        id="fd-resv-name"
        label="Full name"
        required
        autoComplete="name"
        value={values.name}
        onChange={(v) => setField("name", v)}
        onBlur={() => handleBlur("name")}
        error={touched.name ? errors.name : undefined}
      />
      <Field
        id="fd-resv-email"
        type="email"
        label="Email"
        required
        autoComplete="email"
        inputMode="email"
        value={values.email}
        onChange={(v) => setField("email", v)}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : undefined}
      />
      <Field
        id="fd-resv-phone"
        type="tel"
        label="Phone"
        required
        autoComplete="tel"
        inputMode="tel"
        value={values.phone}
        onChange={(v) => setField("phone", v)}
        onBlur={() => handleBlur("phone")}
        error={touched.phone ? errors.phone : undefined}
      />
      <Field
        id="fd-resv-occasion"
        label="Occasion (optional)"
        as="select"
        value={values.occasion ?? ""}
        onChange={(v) => setField("occasion", v || undefined)}
        options={OCCASIONS.map((o) => ({ value: o, label: o }))}
        placeholder="Select an occasion"
      />

      <Field
        id="fd-resv-date"
        type="date"
        label="Date"
        required
        value={values.date}
        onChange={(v) => setField("date", v)}
        onBlur={() => handleBlur("date")}
        error={touched.date ? errors.date : undefined}
      />
      <Field
        id="fd-resv-time"
        label="Time"
        required
        as="select"
        value={values.time}
        onChange={(v) => setField("time", v)}
        onBlur={() => handleBlur("time")}
        error={touched.time ? errors.time : undefined}
        options={timeSlots.map((t) => ({
          value: t,
          label: formatTime(t),
        }))}
      />

      <Field
        id="fd-resv-party"
        type="number"
        label="Party size"
        required
        min={minPartySize}
        max={maxPartySize}
        value={String(values.partySize)}
        onChange={(v) => setField("partySize", Math.max(0, Number(v) || 0))}
        onBlur={() => handleBlur("partySize")}
        error={touched.partySize ? errors.partySize : undefined}
        hint={`Up to ${maxPartySize} guests. For larger parties, please call.`}
      />
      <Field
        id="fd-resv-notes"
        label="Special requests (optional)"
        as="textarea"
        rows={3}
        value={values.specialRequests ?? ""}
        onChange={(v) => setField("specialRequests", v)}
        hint="Allergies, accessibility needs, dietary preferences."
      />

      {/* ─── Submit + status ───────────────────────────────────────── */}
      <div className="md:col-span-2 mt-[var(--space-2)] flex flex-col gap-[var(--space-3)]">
        {status === "ok" && (
          <p
            role="status"
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-success)] bg-[color:rgba(92,120,72,0.08)] px-[var(--space-4)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-success)]"
          >
            <CheckCircle2 className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
            Reservation received. We&apos;ll confirm by email within the hour.
          </p>
        )}
        {status === "error" && (
          <p
            role="alert"
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-error)] bg-[color:rgba(160,69,69,0.08)] px-[var(--space-4)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-error)]"
          >
            <AlertCircle className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
            We couldn&apos;t reach the reservation service. Please try again or call us.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-6)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-semibold)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <CalendarCheck2 className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
          {status === "submitting" ? "Sending…" : "Request reservation"}
        </button>

        <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-text-muted)]">
          For parties of 9 or more, please call us directly at{" "}
          <a
            href="tel:+15550123456"
            className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            +1 (555) 012-3456
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function formatTime(hhmm: string): string {
  const [hStr = "0", mStr = "00"] = hhmm.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

// ─── Field helper ─────────────────────────────────────────────────────────

interface BaseFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

type TextFieldProps = BaseFieldProps & {
  as?: "input";
  type?: "text" | "email" | "tel" | "date" | "number";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric" | "decimal" | "search";
  min?: number;
  max?: number;
};

type SelectFieldProps = BaseFieldProps & {
  as: "select";
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
};

type TextareaFieldProps = BaseFieldProps & {
  as: "textarea";
  rows?: number;
};

type FieldProps = TextFieldProps | SelectFieldProps | TextareaFieldProps;

function Field(props: FieldProps) {
  const { id, label, required, error, hint, value, onChange, onBlur } = props;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  const labelClass =
    "block font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text)]";
  const controlBase =
    "block w-full min-h-[var(--space-7)] rounded-[var(--radius-sm)] border bg-[color:var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-muted)] transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] focus:outline-2 focus:outline-offset-2";
  const borderClass = error
    ? "border-[color:var(--color-error)] focus:outline-[color:var(--color-error)]"
    : "border-[color:var(--color-border)] focus:border-[color:var(--color-primary-500)] focus:outline-[color:var(--color-focus-ring)]";

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && (
          <span
            aria-hidden="true"
            className="ml-[var(--space-1)] text-[color:var(--color-primary-500)]"
          >
            *
          </span>
        )}
      </label>

      {props.as === "select" ? (
        <select
          id={id}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${controlBase} ${borderClass}`}
        >
          {props.placeholder && (
            <option value="" disabled>
              {props.placeholder}
            </option>
          )}
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : props.as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          rows={props.rows ?? 3}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${controlBase} ${borderClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={props.type ?? "text"}
          value={value}
          required={required}
          autoComplete={props.autoComplete}
          inputMode={props.inputMode}
          min={props.min}
          max={props.max}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${controlBase} ${borderClass}`}
        />
      )}

      {hint && !error && (
        <p
          id={hintId}
          className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-text-muted)]"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="inline-flex items-center gap-[var(--space-1)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-error)]"
        >
          <AlertCircle className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export default ReservationForm;
