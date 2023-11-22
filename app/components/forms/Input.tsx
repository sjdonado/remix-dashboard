import clsx from 'clsx';

import type { FC, InputHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  icon?: JSX.Element;
}

export const Input: FC<InputProps> = ({ name, label, icon, ...rest }) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            className={clsx(
              'peer block w-full rounded-md border border-base-200 py-2 pl-10 text-sm outline-2 placeholder:text-content',
              error && 'input-error'
            )}
            {...rest}
            {...getInputProps({ id: name })}
          />
          {icon && icon}
        </div>
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};
