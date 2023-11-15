import type { FC, InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export const FormInput: FC<InputProps> = ({ name, label, ...rest }) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={name} className="text-sm mb-1">
        {label}
      </label>
      <input
        className={`input input-bordered w-full max-w-xs ${error ? 'input-error' : ''}`}
        {...rest}
        {...getInputProps({ id: name })}
      />

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};
