import { useState } from "react"
import { ExportToExcel } from "../../components/Button"
import SearchForm from "../../components/SearchForm"
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import { formatDate } from "../../lib/utils"

const formInputs: _SearchFormInput[] = [
   { name: "date_from", type: "date", required: true },
   { name: "date_to", type: "date", required: true },
   { name: "terminal_id" },
   {
      name: "rrn",
      acronym: true
   },
   {
      name: "pan",
      acronym: true,
      type: "group",
      options: [
         { name: "first_6", placeholder: "First six (6)" },
         { name: "last_4", placeholder: "Last four (4)" }
      ]
   },
]

export default function TransactionManagement() {
   const [queryString, setQueryString] = useState<string>()
   const tableHeaders: _TableHeader[] = [
      {
         label: "date",
         key: "transactionDate",
         sticky: true,
         orderBy: true,
         modifier: date => formatDate(String(date))
      },
      { label: "terminal_id", orderBy: true },
      { label: "pan" },
      { label: "sqn" },
      { label: "rrn" },
      { label: "amount", orderBy: true },
      { label: "action" },
      { label: "issuer" },
      { label: "fep" },
      { label: "cba" },
      { label: "account_number" },
      { label: "till_account" },
   ]

   const request = useInfiniteFetchWrapper({
      queryKey: ['transaction-management'],
      url: "exceptions/report?type=6",
      enabled: !!queryString,
      queryString,
      tableProps: {
         data: [],
         headers: tableHeaders
      }
   })

   return (
      <>
         <div className="px-8">
            <div className="flex justify-between">
               <SearchForm
                  data={formInputs}
                  search={setQueryString}
                  refetch={request.refetch}
               />
               {
                  request.data?.length ?
                     <ExportToExcel
                        data={request.data}
                        headers={tableHeaders}
                        filename="reports-Successful-transactions"
                     />
                     : null
               }
            </div>
         </div>
         <section className="px-8 flex-1 overflow-y-hidden">
            {request.Table}
         </section>
      </>
   )
}