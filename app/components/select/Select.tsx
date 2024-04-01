import clsx from 'clsx';

import type { FC, SelectHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  icon?: JSX.Element;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: FC<SelectProps> = ({ name, label, icon, onChange, ...rest }) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          className={clsx(
            'peer select input-bordered select-sm !h-10 w-full rounded-md !pl-9',
            error && 'input-error'
          )}
          {...rest}
          {...getInputProps({ id: name, onChange })}
        />
        {icon && icon}
      </div>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
};
