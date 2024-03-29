import type { SubmitOptions } from '@remix-run/react';
import { useFetcher } from '@remix-run/react';
import { useState, useEffect, createContext, useContext } from 'react';

const FetcherFormContext = createContext<
  [(formData: FormData) => void, (callback?: () => void) => void, string?]
>([() => null, () => null]);

export const useFetcherForm = () => {
  const [onChange, submitForm, error] = useContext(FetcherFormContext);
  return {
    onChange,
    submitForm,
    error,
  };
};

export default function FetcherFormProvider({
  action,
  method,
  children,
}: {
  action: string;
  method: SubmitOptions['method'];
  children: React.ReactNode;
}) {
  const fetcher = useFetcher();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>();

  const [formData, setFormData] = useState<FormData>();
  const [registeredCallback, setRegisteredCallback] = useState<() => void>();

  useEffect(() => {
    const response = fetcher.data as { error: string } | undefined;

    if (isSubmitted || error) return;

    if (fetcher.state === 'loading' && response) {
      if (response.error) {
        setError(response.error);
        return;
      }
      setIsSubmitted(true);
      registeredCallback?.();
    }
  }, [fetcher, action, formData, isSubmitted, error, registeredCallback]);

  return (
    <FetcherFormContext.Provider
      value={[
        (formData: FormData) => {
          setFormData(formData);
          setError(undefined);
        },
        callback => {
          if (formData) {
            fetcher.submit(formData, {
              method,
              action,
            });
            setRegisteredCallback(() => callback);
          }
        },
        error,
      ]}
    >
      {children}
    </FetcherFormContext.Provider>
  );
}
