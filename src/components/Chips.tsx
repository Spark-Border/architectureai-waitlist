"use client";

import { Check } from "lucide-react";

/*
 * Selectable options as chips: one tap instead of open-a-list-and-pick, and every
 * option is visible at once. Real radio / checkbox inputs underneath, so keyboard
 * and screen readers behave natively. Selection is shown by border, tint, weight
 * and a check mark, never by colour alone.
 */
export default function Chips({
  legend,
  name,
  options,
  value,
  onChange,
  multiple = false,
  optional = false,
  error,
  errorId,
}: Readonly<{
  legend: string;
  name: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  optional?: boolean;
  error?: string;
  errorId?: string;
}>) {
  const toggle = (option: string) => {
    if (!multiple) return onChange([option]);
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <fieldset className="mb-5 min-w-0 border-0 p-0" aria-describedby={error ? errorId : undefined}>
      <legend className="t-ui mb-2 text-ink">
        {legend}
        {optional && <span className="ml-1.5 font-normal text-soft">Optional</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value.includes(option);
          return (
            <label key={option} className="cursor-pointer">
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option}
                checked={checked}
                onChange={() => toggle(option)}
                className="peer sr-only"
              />
              <span
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-sm border px-3 text-[13px] transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal md:min-h-9 ${
                  checked
                    ? "border-teal bg-teal-soft font-semibold text-ink"
                    : "border-field bg-paper text-ink hover:border-soft"
                }`}
              >
                {checked && <Check size={14} strokeWidth={2.25} aria-hidden="true" />}
                {option}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
