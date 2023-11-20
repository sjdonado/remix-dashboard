import type { UserSerialized } from '~/schemas/user';
import Pagination from './Pagination';

interface TableProps {
  data: UserSerialized[];
  headers: string[];
  totalPages: number;
  currentPage: number;
}

export default function Table({ data, headers, totalPages, currentPage }: TableProps) {
  const columns = headers as Array<keyof UserSerialized>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          <div className="md:hidden max-h-[calc(100vh-200px)] overflow-y-scroll">
            {data?.map(item => (
              <div key={item.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {/* <Image */}
                      {/*   src={invoice.image_url} */}
                      {/*   className="mr-2 rounded-full" */}
                      {/*   width={28} */}
                      {/*   height={28} */}
                      {/*   alt={`${invoice.name}'s profile picture`} */}
                      {/* /> */}
                      <p>{item[columns[0]]}</p>
                    </div>
                    <p className="text-sm text-gray-500">{item[columns[1]]}</p>
                  </div>
                  <span className="text-sm font-medium">{item[columns[2]]}</span>
                  {/* <InvoiceStatus status={invoice.status} /> */}
                </div>
                {/* <div className="flex w-full items-center justify-between pt-4"> */}
                {/*   <div> */}
                {/*     <p className="text-xl font-medium"> */}
                {/*       {formatCurrency(invoice.amount)} */}
                {/*     </p> */}
                {/*     <p>{formatDateToLocal(invoice.date)}</p> */}
                {/*   </div> */}
                {/*   <div className="flex justify-end gap-2"> */}
                {/*     <UpdateInvoice id={invoice.id} /> */}
                {/*     <DeleteInvoice id={invoice.id} /> */}
                {/*   </div> */}
                {/* </div> */}
              </div>
            ))}
          </div>
          <table className="hidden text-gray-900 w-full md:table">
            <thead className="rounded-lg w-full">
              <tr className="flex items-start gap-4 w-full py-2">
                {headers.map(header => (
                  <th key={header} scope="col" className="flex-1">
                    {header}
                  </th>
                ))}
                <th scope="col" className="flex-1">
                  {/*   <span className="sr-only">Edit</span> */}
                </th>
              </tr>
            </thead>
            <tbody className="flex flex-col items-center justify-between gap-4 w-full max-h-[calc(100vh-250px)] overflow-y-scroll bg-white">
              {data?.map(item => (
                <tr key={item.id} className="flex-1 flex items-start gap-3 py-1 w-full">
                  <td className="flex-1 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {/* <Image */}
                      {/*   src={invoice.image_url} */}
                      {/*   className="rounded-full" */}
                      {/*   width={28} */}
                      {/*   height={28} */}
                      {/*   alt={`${invoice.name}'s profile picture`} */}
                      {/* /> */}
                      <p>{item[columns[0]]}</p>
                    </div>
                  </td>
                  <td className="flex-1 whitespace-nowrap">{item[columns[1]]}</td>
                  {/* <td className="whitespace-nowrap px-3 py-3"> */}
                  {/*   {formatCurrency(invoice.amount)} */}
                  {/* </td> */}
                  {/* <td className="whitespace-nowrap px-3 py-3"> */}
                  {/*   {formatDateToLocal(invoice.date)} */}
                  {/* </td> */}
                  <td className="flex-1 whitespace-nowrap">
                    {item[columns[2]]}
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </td>
                  <td className="flex-1 whitespace-nowrap">
                    {/* <div className="flex justify-end gap-3"> */}
                    {/*   <UpdateInvoice id={invoice.id} /> */}
                    {/*   <DeleteInvoice id={invoice.id} /> */}
                    {/* </div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
