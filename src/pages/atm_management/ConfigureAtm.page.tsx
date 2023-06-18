import { useState } from "react"
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import Search from "../../components/Search"
import { useStore } from "../../contexts/Store.context"

const _key = 'atms-terminals'

export default function ConfigureAtm() {
   const { statesList, brandsList } = useStore()
   const [searchTerm, setSearchTerm] = useState(null)
   const queryString = searchTerm ? `searchTerm=${searchTerm}` : ""

   const request = useInfiniteFetchWrapper({
      url: "atms/terminals",
      queryString,
      queryKey: [_key, searchTerm],
      tableProps: {
         data: [],
         headers: getTableHeaders(brandsList, statesList),
         mutationUrl: "atms/update",
         refetchKey: [_key],
         method: "put",
      }
   })

   return (
      <div className="pt-8 pb-4 space-y-4 flex flex-col h-full overflow-hidden">
         <div className="px-8 flex items-center space-x-4">
            <Search
               placeholder="Search Terminal ID or Sol ID..."
               isLoading={request.isLoading}
               search={setSearchTerm}
               refetch={request.refetch}
            />
         </div>
         <section className="px-8 flex-1 overflow-y-hidden">
            {request.Table}
         </section>
      </div>
   )
}

const getTableHeaders = (brands: _SelectInputOption[], states: _SelectInputOption[]): _TableHeader[] => [
   {
      key: "terminalId",
      label: "terminal_id"
   },
   {
      key: "ipAddress",
      label: "ip_address",
      capitalize: false
   },
   {
      key: "solId",
      label: "sol_id"
   },
   {
      label: "brand",
      orderBy: true,
      elementType: {
         name: "select",
         initialOptions: brands,
      },
   },
   {
      label: "region",
      orderBy: true
   },
   {
      label: "state",
      orderBy: true,
      elementType: {
         name: "select",
         initialOptions: states,
      }
   },
   { key: "shortName", label: "short_name" },
   { label: "branch" },
   { label: "location" },
   { label: "till_account", key: "tillAccount" },
]