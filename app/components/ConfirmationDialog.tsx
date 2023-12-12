import { forwardRef, useRef, type MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import { Form } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';

interface ModalProps {
  title: string;
  description: string;
  button: string;
  action: string;
}

export const DialogModal = forwardRef(function ConfirmationDialog(
  { title, description, button, action }: ModalProps,
  ref
) {
  return (
    <dialog
      ref={ref as MutableRefObject<HTMLDialogElement>}
      className="modal modal-bottom sm:rounded-lg sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="py-4">{description}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn rounded-lg">Cancel</button>
          </form>
          <Form action={action}>
            <button className="btn btn-error error-content text-base-100 rounded-lg">
              {button}
            </button>
          </Form>
        </div>
      </div>
    </dialog>
  );
});

interface DialogModalButtonProps {
  title: string;
  description: string;
  button: string;
  action: string;
  className?: string;
  children: React.ReactNode;
}

export function DialogModalButton({
  title,
  description,
  button,
  action,
  className,
  children,
}: DialogModalButtonProps) {
  const dialog = useRef<HTMLDialogElement>();

  return (
    <ClientOnly>
      {() => (
        <>
          {createPortal(
            <DialogModal
              ref={dialog}
              title={title}
              description={description}
              button={button}
              action={action}
            />,
            document.body
          )}
          <button className={className} onClick={() => dialog.current?.showModal()}>
            {children}
          </button>
        </>
      )}
    </ClientOnly>
  );
}
