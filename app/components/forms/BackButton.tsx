import { useNavigate } from '@remix-run/react';

interface BackButtonProps {
  message: string;
}

export default function BackButton({ message }: BackButtonProps) {
  const navigate = useNavigate();

  const handleOnClick = () => {
    return window.history.length > 2 ? navigate(-1) : navigate('..');
  };

  return (
    <button
      className="btn btn-base btn-sm rounded-lg font-normal h-10"
      onClick={handleOnClick}
      type="button"
    >
      {message}
    </button>
  );
}
