import { createPortal } from 'react-dom';
import { ClientOnly } from 'remix-utils/client-only';

import { forwardRef, useRef, type MutableRefObject, useState, useEffect } from 'react';
import { Form } from '@remix-run/react';

interface DialogModalProps {
  title: string;
  description: string;
  button: string;
  action: string;
  method: 'post' | undefined;
  setIsAttached: (isAttached: boolean) => void;
}

export const DialogModal = forwardRef(function ConfirmationDialog(
  { title, description, button, action, method, setIsAttached }: DialogModalProps,
  ref
) {
  return (
    <dialog
      id="confirmation-modal"
      ref={ref as MutableRefObject<HTMLDialogElement>}
      className="modal modal-bottom sm:modal-middle sm:rounded-lg"
    >
      <div className="modal-box">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="whitespace-pre-wrap py-4">{description}</p>
        <div className="modal-action">
          <button
            className="btn btn-sm h-10 w-[90px] rounded-lg font-normal"
            onClick={() => setIsAttached(false)}
          >
            Cancel
          </button>
          <Form action={action} {...{ method }}>
            <button className="btn btn-error btn-sm h-10 w-[90px] rounded-lg font-normal text-base-100">
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
  method?: 'post' | undefined;
  className?: string;
  children: React.ReactNode;
}

export function DialogModalButton({
  title,
  description,
  button,
  action,
  method,
  className,
  children,
}: DialogModalButtonProps) {
  const [isAttached, setIsAttached] = useState(false);
  const dialog = useRef<HTMLDialogElement>();

  useEffect(() => {
    if (isAttached) {
      dialog.current?.showModal();
    }
  }, [isAttached, dialog]);

  return (
    <ClientOnly>
      {() => (
        <>
          {isAttached &&
            createPortal(
              <DialogModal
                ref={dialog}
                title={title}
                description={description}
                button={button}
                action={action}
                method={method}
                setIsAttached={setIsAttached}
              />,
              document.body
            )}
          <button type="button" className={className} onClick={() => setIsAttached(true)}>
            {children}
          </button>
        </>
      )}
    </ClientOnly>
  );
}
