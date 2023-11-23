import clsx from 'clsx';

import type { FC, InputHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  icon?: JSX.Element;
}

export const TextArea: FC<TextAreaProps> = ({ name, label, icon, ...rest }) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <textarea
            className={clsx(
              'peer textarea textarea-sm textarea-bordered rounded-md w-full leading-5 py-2 h-20 !pl-9',
              error && 'textarea-error'
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
