import { useNavigate, useNavigation } from '@remix-run/react';

interface BackButtonProps {
  message: string;
}

export default function BackButton({ message }: BackButtonProps) {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const handleOnClick = () => {
    return window.history.length > 2 ? navigate(-1) : navigate('..');
  };

  return (
    <button
      type="button"
      className="btn btn-sm h-10 w-[90px] rounded-lg font-normal"
      onClick={handleOnClick}
      disabled={navigation.state !== 'idle'}
    >
      {message}
    </button>
  );
}
