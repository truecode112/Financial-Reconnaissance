import { useState } from "react"
import Table from "../../components/Table"
import SearchForm from "../../components/SearchForm"
import { ExportToExcel } from "../../components/Button"
import { queryLimit, useFetch } from "../../lib/fetch"
import { formatDate } from "../../lib/utils"

const tableHeaders: _TableHeader[] = [
   {
      label: "date",
      key: "transactionDate",
      orderBy: true,
      sticky: true,
      modifier: date => formatDate(String(date))
   },
   { label: "terminal_id", orderBy: true },
   { label: "sqn" },
   { label: "rrn" },
   { label: "amount", orderBy: true },
   { label: "action" },
   { label: "issuer" },
   { label: "pan" },
   { label: "account_number" },
   { label: "auto-reversed" },
   { label: "dispense_error" },
   { label: "claim" },
]

const formInputs: _SearchFormInput[] = [
   { name: "date_from", type: "date", required: true },
   { name: "date_to", type: "date", required: true },
   { name: "terminal_id", required: true },
   { name: "account_number" },
]

export default function TransactionInvestigation() {
   const [offset, setOffset] = useState(0)
   const [queryString, setQueryString] = useState<string>()

   const fetcher = useFetch({
      queryKey: [`trx-investigations`, queryString],
      url: `exceptions/traninvestigation?${queryString}`,
      enabled: !!queryString,
   })

   const slicedData = fetcher.data?.slice?.(0, (1 + offset) * queryLimit)

   return (
      <div className="p-8 pb-4 space-y-4 flex flex-col h-full overflow-y-auto scrollbar">
         <div className="">
            <div className="flex justify-between">
               <SearchForm
                  data={formInputs}
                  search={setQueryString}
                  refetch={fetcher.refetch}
               />
               <div className="space-x-4 flex flex-1 justify-end">
                  {
                     fetcher.data?.length ?
                        <ExportToExcel
                           data={fetcher.data}
                           headers={tableHeaders}
                           filename="trx-investigation"
                        />
                        : null
                  }
               </div>
            </div>
         </div>
         <section className="flex-1 overflow-y-hidden shadow-lg">
            <Table
               data={slicedData}
               headers={tableHeaders}
               setOffset={setOffset}
               fetchMore={slicedData?.length < fetcher.data?.length}
            />
         </section>
      </div>
   )
}

