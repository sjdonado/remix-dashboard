import { useNavigation } from '@remix-run/react';

interface SubmitButtonProps {
  message: string;
}

export default function SubmitButton({ message }: SubmitButtonProps) {
  const navigation = useNavigation();

  return (
    <button
      className="btn btn-primary btn-sm rounded-lg font-normal text-base-100 h-10"
      type="submit"
      disabled={navigation.state === 'submitting'}
    >
      {message}
    </button>
  );
}
