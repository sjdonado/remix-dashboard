import Pagination from './Pagination';

interface TableProps {
  totalPages: number;
  currentPage: number;
  children: React.ReactNode;
}

export function TableContainer({ totalPages, currentPage, children }: TableProps) {
  if (totalPages === 0) return <p className="text-center m-4">No results</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-base-200/50 p-2 md:pt-0">{children}</div>
      </div>
      <div className="flex-1 flex justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

export function MobileTable({ children }: { children: React.ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}

export function ResponsiveTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <table className="hidden min-w-full text-content md:table">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          {headers.map(header => (
            <th key={header} scope="col" className="px-4 py-5 font-medium text-content">
              {header}
            </th>
          ))}
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-base-100">{children}</tbody>
    </table>
  );
}
