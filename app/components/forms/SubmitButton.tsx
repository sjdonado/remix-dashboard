import { useNavigation } from '@remix-run/react';
import { useIsValid } from 'remix-validated-form';

interface SubmitButtonProps {
  message: string;
}

export default function SubmitButton({ message }: SubmitButtonProps) {
  const isValid = useIsValid();
  const navigation = useNavigation();

  return (
    <button
      className="btn btn-primary btn-sm !h-10 w-[90px] rounded-lg font-normal"
      type="submit"
      disabled={navigation.state !== 'idle' || !isValid}
    >
      {message}
    </button>
  );
}
