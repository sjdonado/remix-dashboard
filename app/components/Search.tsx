import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate, useSearchParams } from '@remix-run/react';

import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = useDebouncedCallback(term => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    params.set('page', '1');
    navigate(`${pathname}?${params.toString()}`);
  }, 300);

  const query = searchParams.get('q')?.toString();

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-lg border border-base-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-content"
        placeholder={placeholder}
        onChange={e => handleSearch(e.target.value)}
        defaultValue={query}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-content peer-focus:text-content" />
    </div>
  );
}
