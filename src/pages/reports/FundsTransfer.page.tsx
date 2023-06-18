import { useState } from "react"
import { ExportToExcel } from "../../components/Button"
import SearchForm from "../../components/SearchForm"
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import { formatDate } from "../../lib/utils"

const formInputs: _SearchFormInput[] = [
   { name: "date_from", type: "date", required: true },
   { name: "date_to", type: "date", required: true },
   { name: "till_account" },
   {
      name: "issuer",
      type: "radio",
      options: [
         { name: "all", value: "" },
         { name: "on_us", value: 1 },
         { name: "not_on_us", value: 0 },
      ]
   },
]

export default function FundsTransfer() {
   const [queryString, setQueryString] = useState<string>()
   const tableHeaders: _TableHeader[] = [
      {
         label: "date",
         key: "transactionDate",
         sticky: true,
         modifier: date => formatDate(String(date))
      },
      { label: "till_account" },
      { label: "narration" },
      { label: "amount" },
      { label: "credit_account", key: "accountNumber" },
      { label: "issuer" },
      {
         label: "accepted_date",
         key: "acceptanceDate",
         modifier: date => formatDate(String(date))
      },
   ]

   const request = useInfiniteFetchWrapper({
      queryKey: ['funds-transfer'],
      url: "exceptions/fundtransfer",
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
                        filename="reports-funds-transfer"
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