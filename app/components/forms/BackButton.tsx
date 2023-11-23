import { useNavigate } from '@remix-run/react';

interface BackButtonProps {
  message: string;
}

export default function BackButton({ message }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-base btn-sm rounded-lg font-normal h-10"
      onClick={() => navigate(-1)}
      type="button"
    >
      {message}
    </button>
  );
}
