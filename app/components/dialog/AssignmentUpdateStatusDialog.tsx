import { createPortal } from 'react-dom';
import { ClientOnly } from 'remix-utils/client-only';

import {
  forwardRef,
  useRef,
  type MutableRefObject,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { useNavigation } from '@remix-run/react';

import { AssignmentStatus } from '~/constants/assignment';

import FetcherFormProvider, { useFetcherForm } from './FetcherForm';
import { AssignmentStatusBadge } from '../badge/AssignmentStatusBadge';
import { AssignmentStatusSelect } from '../select/AssignmentStatusSelect';

const AssignmentUpdateStatusDialog = forwardRef(function AssignmentUpdateStatusDialog(
  {
    defaultStatus,
    setIsAttached,
  }: {
    defaultStatus?: AssignmentStatus;
    setIsAttached: (isAttached: boolean) => void;
  },
  ref
) {
  const navigation = useNavigation();

  const { submitForm, onChange, isSubmitted, error } = useFetcherForm();

  useEffect(() => {
    if (isSubmitted) {
      setIsAttached(false);
    }
  }, [isSubmitted, setIsAttached]);

  return (
    <dialog ref={ref as MutableRefObject<HTMLDialogElement>} className="modal rounded-lg">
      <div className="modal-box w-full max-w-5xl sm:w-9/12 xl:w-5/12">
        <h3 className="text-xl font-bold">Update status</h3>
        <AssignmentUpdateStatusForm
          defaultStatus={defaultStatus}
          error={error}
          onChange={formData => {
            onChange(formData);
          }}
        />
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-primary btn-sm h-10 w-[90px] rounded-lg text-white"
            disabled={navigation.state !== 'idle'}
            onClick={() => submitForm()}
          >
            Continue
          </button>
        </div>
      </div>
    </dialog>
  );
});

const AssignmentUpdateStatusForm = ({
  defaultStatus,
  onChange,
  error,
}: {
  defaultStatus?: AssignmentStatus;
  onChange: (formData: FormData) => void;
  error?: string;
}) => {
  const formData = useMemo(() => new FormData(), []);

  useEffect(() => {
    if (defaultStatus) {
      formData.append('status', defaultStatus);
    }
    onChange(formData);
  }, [defaultStatus, onChange, formData]);

  return (
    <div className="flex flex-col gap-4 pt-6">
      <AssignmentStatusSelect
        defaultValue={defaultStatus}
        error={error}
        onChange={e => {
          formData.set('status', e.target.value);
          onChange(formData);
        }}
      />
    </div>
  );
};

export function AssignmentUpdateStatusDialogButton({
  assignmentId,
  status,
}: {
  assignmentId: string;
  status: AssignmentStatus;
}) {
  const dialog = useRef<HTMLDialogElement>();
  const [isAttached, setIsAttached] = useState(false);

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
              <FetcherFormProvider
                action={`/assignments/${assignmentId}/status`}
                method="post"
              >
                <AssignmentUpdateStatusDialog
                  ref={dialog}
                  defaultStatus={
                    status === AssignmentStatus.Open
                      ? AssignmentStatus.Closed
                      : AssignmentStatus.Open
                  }
                  setIsAttached={setIsAttached}
                />
              </FetcherFormProvider>,
              document.body
            )}
          <button
            type="button"
            className="cursor-pointer leading-none"
            onClick={() => setIsAttached(true)}
          >
            <AssignmentStatusBadge status={status} />
          </button>
        </>
      )}
    </ClientOnly>
  );
}
