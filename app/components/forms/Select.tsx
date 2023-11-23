import clsx from 'clsx';

import type { FC, SelectHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  icon?: JSX.Element;
}

export const Select: FC<SelectProps> = ({ name, label, icon, ...rest }) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          className={clsx(
            'peer select select-sm input-bordered rounded-md w-full !h-10 !pl-9',
            error && 'input-error'
          )}
          {...rest}
          {...getInputProps({ id: name })}
        />
        {icon && icon}
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};
