import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import { sanitizeNumberInput } from "../../lib/utils"

const tableHeader: _TableHeader[] = [
   {
      label: "terminal_id",
      key: "terminalID",
      elementType: {
         name: 'static'
      }
   },
   {
      label: "last_cash_added",
      key: "count",
      suffix: "(count)",
      elementType: {
         name: 'static'
      }
   },
   {
      key: "custEvac",
      label: "amount_evacuated",
      placeholder: "Enter Amount",
      modifier: sanitizeNumberInput,
      elementType: {
         empty: true,
      }
   },
]

export default function CashEvacuated() {
   const request = useInfiniteFetchWrapper({
      queryKey: ['cash-evacuated'],
      url: "statistics/getcash",
      tableProps: {
         data: [],
         headers: tableHeader,
         mutationUrl: "statistics/update",
         method: "put"
      }
   })
   return (
      <div className="pt-8 pb-4 flex flex-col h-full overflow-y-auto scrollbar">
         <section className="px-8 flex-1 overflow-y-hidden">
            {request.Table}
         </section>
      </div>
   )
}

