interface SubmitButtonProps {
  message: string;
}

export default function SubmitButton({ message }: SubmitButtonProps) {
  return (
    <button
      className="btn btn-primary btn-sm rounded-lg font-normal text-base-100 h-10"
      type="submit"
    >
      {message}
    </button>
  );
}
