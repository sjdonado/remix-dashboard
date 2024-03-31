import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { useNavigation } from '@remix-run/react';

export default function LoadingBar() {
  const navigation = useNavigation();

  const isIdle = navigation.state === 'idle';
  const isLoading = navigation.state === 'loading';
  const isSubmitting = navigation.state === 'submitting';

  const active = !isIdle;

  const ref = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    if (active) setAnimationComplete(false);

    Promise.allSettled(ref.current.getAnimations().map(({ finished }) => finished)).then(
      () => !active && setAnimationComplete(true)
    );
  }, [active]);

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? 'Loading' : undefined}
      className="fixed inset-x-0 top-0 z-50 h-1 animate-pulse"
    >
      <div
        ref={ref}
        className={clsx('h-full bg-primary transition-all duration-300 ease-in-out', {
          'w-0 opacity-0 transition-none': isIdle && animationComplete,
          'w-full': isIdle && !animationComplete,
          'w-4/12': isSubmitting,
          'w-10/12': isLoading,
        })}
      />
    </div>
  );
}
