import Table from "../../components/Table"
import { ExportToExcel } from "../../components/Button"
import Search from "../../components/Search"
import InfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import { useStore } from "../../contexts/Store.context"
import { useState } from "react"


export default function UserList() {
   const { statesList, rolesList } = useStore()
   const [request, setRequest] = useState({})
   const [searchTerm, setSearchTerm] = useState(null)
   const queryString = searchTerm ? `searchTerm=${searchTerm}` : ""

   const tableHeaders = [
      { label: "username", orderBy: true, capitalize: false },
      { label: "role", initialOptions: rolesList },
      { label: "state", initialOptions: statesList },
      { label: "sol_id" }
   ]

   return (
      <div className="pt-8 pb-4 flex flex-col h-full space-y-4 overflow-y-auto scrollbar">
         <div className="px-8 flex justify-between">
            <div className="flex-1">
               <Search
                  search={setSearchTerm}
                  placeholder="Search Staff ID"
                  isLoading={request.isLoading}
                  refetch={request.refetch}
               />
            </div>
            {
               request.data?.length ?
                  <ExportToExcel
                     data={request.data}
                     headers={tableHeaders}
                     filename="user-management_user-list"
                  />
                  : null
            }
         </div>

         <section className="px-8 flex-1 overflow-y-hidden">
            <InfiniteFetchWrapper
               url="passport/users"
               setRequest={setRequest}
               queryString={queryString}
               key={searchTerm}
            >
               <Table headers={tableHeaders} />
            </InfiniteFetchWrapper>
         </section>
      </div>
   )
}

