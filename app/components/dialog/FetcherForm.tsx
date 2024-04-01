import type { SubmitOptions } from '@remix-run/react';
import { useFetcher } from '@remix-run/react';
import { useState, useEffect, createContext, useContext } from 'react';

const FetcherFormContext = createContext<
  [(formData: FormData) => void, (callback?: () => void) => void, boolean, string?]
>([() => null, () => null, false]);

export const useFetcherForm = () => {
  const [onChange, submitForm, isSubmitted, error] = useContext(FetcherFormContext);
  return {
    onChange,
    submitForm,
    isSubmitted,
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

  useEffect(() => {
    const response = fetcher.data as { error: string; message: string } | undefined;

    if (isSubmitted || error) return;

    if (fetcher.state === 'loading' && response) {
      if (response.error) {
        setError(response.error);
        return;
      }
      setIsSubmitted(true);
    }
  }, [fetcher, action, formData, isSubmitted, error]);

  return (
    <FetcherFormContext.Provider
      value={[
        (formData: FormData) => {
          setFormData(formData);
          setError(undefined);
        },
        () => {
          if (formData) {
            fetcher.submit(formData, {
              method,
              action,
            });
          }
        },
        isSubmitted,
        error,
      ]}
    >
      {children}
    </FetcherFormContext.Provider>
  );
}
