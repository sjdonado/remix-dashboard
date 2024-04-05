import clsx from 'clsx';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useSearchParams } from '@remix-run/react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="mx-4 mb-4 inline-flex">
      <PaginationArrow
        id="pagination-previous"
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />
      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';

          return (
            <PaginationNumber
              key={page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>
      <PaginationArrow
        id="pagination-next"
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'border-base-custom flex h-8 w-10 items-center justify-center border text-sm',
    {
      'rounded-l-lg': position === 'first' || position === 'single',
      'rounded-r-lg': position === 'last' || position === 'single',
      'bg-primary border-primary text-white': isActive,
      'hover:bg-base-200': !isActive && position !== 'middle',
      'text-gray-500': position === 'middle',
    }
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link to={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  id,
  href,
  direction,
  isDisabled,
}: {
  id: string;
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'border-base-custom flex h-8 w-10 items-center justify-center rounded-lg border',
    {
      'pointer-events-none text-gray-500': isDisabled,
      'hover:bg-base-200': !isDisabled,
      'mr-2 md:mr-2': direction === 'left',
      'ml-2 md:ml-2': direction === 'right',
    }
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div id={id} className={className}>
      {icon}
    </div>
  ) : (
    <Link id={id} className={className} to={href}>
      {icon}
    </Link>
  );
}

const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
