import { useState } from "react"
import { ExportToExcel } from "@/components/Button"
import useInfiniteFetchWrapper from "@/components/InfiniteFetchWrapper"
import Search from "@/components/Search"
import StaticForm from "@/components/StaticForm"
import useBoxes from "@/components/useBoxes"
import { useStore } from "@/contexts/Store.context"
import { sanitizeNumberInput } from "@/lib/utils"
import { isValidNumber } from "@/lib/numbers"


export default function CreateModifyUser() {
   const components: _BoxComponent[] = [
      { title: "Create User", component: CreateUser },
      { title: "Modify User", component: ModifyUser }
   ]
   const boxes = useBoxes({ components })
   const ActiveComponent = components[boxes.index].component

   return (
      <div className="h-full flex flex-col">
         {boxes.Tabs}
         <div className="px-8 pt-6 pb-4 space-y-4 flex flex-col flex-1 overflow-y-auto scrollbar">
            <ActiveComponent />
         </div>
      </div>
   )
}

function ModifyUser() {
   const { statesList, rolesList } = useStore()
   const [searchTerm, setSearchTerm] = useState(null)
   const queryString = searchTerm ? `searchTerm=${searchTerm}` : ""

   const tableHeaders: _TableHeader[] = [
      {
         key: "userName",
         label: "staff_id",
         orderBy: true,
         capitalize: false
      },
      {
         label: "role",
         orderBy: true,
         elementType: {
            name: "select",
            initialOptions: rolesList,
         },
      },
      {
         label: "state",
         elementType: {
            name: "select",
            initialOptions: statesList
         },
      },
      {
         key: "solID",
         label: "sol_id",
         modifier: sanitizeNumberInput,
      }
   ]

   const request = useInfiniteFetchWrapper({
      url: "passport/users",
      queryString,
      queryKey: ['users', searchTerm],
      tableProps: {
         data: [],
         headers: tableHeaders,
         mutationUrl: "passport/updateuser",
         refetchKey: ['users'],
         method: "put"
      }
   })

   return (
      <>
         <div className="flex justify-between">
            <Search
               search={setSearchTerm}
               placeholder="Search Staff ID"
               isLoading={request.isLoading}
               refetch={request.refetch}
            />
            {
               request.data?.length ?
                  <ExportToExcel
                     data={request.data}
                     headers={tableHeaders}
                     filename={`user-list`}
                  />
                  : null
            }
         </div>
         {request.Table}
      </>
   )
}

function CreateUser() {
   const { statesList, rolesList } = useStore()

   const formInputs: _SearchFormInput[] = [
      { name: "username", required: true },
      {
         name: "role",
         type: "radio",
         options: rolesList?.map(r => ({ ...r, name: 'role' })),
         required: true
      },
      {
         name: "state",
         type: "select",
         initialOptions: statesList
      },
      {
         name: "solID",
         label: "Sol ID",
         type: "number",
         modifier: (value) => {
            if (["NULL", "Null", "null"].includes(value)) return null
            return isValidNumber(value) ? +value : value
         }
      },
   ]

   return (
      <StaticForm
         data={formInputs}
         buttonText={"Create User"}
         mutationUrl={"passport/register"}
      />
   )
}

