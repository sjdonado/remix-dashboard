import clsx from 'clsx';

import type { FC, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  icon: JSX.Element;
  error?: string;
}

export const BaseInput: FC<InputProps> = ({ name, label, icon, error, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div>
        <div className="relative flex-1">
          <input
            id={name}
            className={clsx(
              'peer input input-sm input-bordered !h-10 w-full rounded-md !pl-9',
              error && 'input-error'
            )}
            {...rest}
          />
          {icon && icon}
        </div>
      </div>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
};
