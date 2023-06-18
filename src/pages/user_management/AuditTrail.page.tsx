import { useState } from "react"
import { ExportToExcel } from "../../components/Button"
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import Search from "../../components/Search"
import useBoxes from "../../components/useBoxes"
import { formatDateTime } from "../../lib/utils"


export default function AuditTrailLoginAudit() {
   const components: _BoxComponent[] = [
      { title: "Audit Trail", component: AuditTrail },
      { title: "Login Audit", component: LoginAudit }
   ]
   const tabs = useBoxes({ components })
   const ActiveComponent = components[tabs.index].component

   return (
      <div className="h-full flex flex-col">
         {tabs.Tabs}
         <div className="pt-4 pb-4 flex flex-col h-full overflow-y-auto scrollbar">
            {<ActiveComponent />}
         </div>
      </div>
   )
}

function AuditTrail() {
   const tableHeaders: _TableHeader[] = [
      { label: "staff_id", capitalize: false },
      {
         key: "module",
         label: "search",
      },
      { label: "description", capitalize: false },
      {
         label: "log_date_time",
         key: "logDateTime",
         modifier: (date) => formatDateTime(date),
      },
      {
         label: "action",
      },
   ]

   const queryData = useInfiniteFetchWrapper({
      queryKey: ['audit-trail'],
      url: "businesslogs/list",
      tableProps: {
         data: [],
         headers: tableHeaders
      }
   })

   return (
      <>
         <div className="px-8 pb-4 flex justify-end">
            {
               queryData.data?.length ?
                  <ExportToExcel
                     data={queryData.data}
                     headers={tableHeaders}
                     filename='audit-trail'
                  />
                  : null
            }
         </div>
         <div className="px-8 flex-1 overflow-y-hidden">
            {queryData.Table}
         </div>
      </>
   )
}

function LoginAudit() {
   const [searchTerm, setSearchTerm] = useState(null)
   const queryString = searchTerm ? `searchTerm=${searchTerm}` : ""

   const tableHeaders: _TableHeader[] = [
      { label: "staff_id", capitalize: false },
      { label: "ip_address" },
      {
         label: "login_date",
         key: "dateTime",
         orderBy: true,
         modifier: date => formatDateTime(String(date))
      }
   ]

   const queryData = useInfiniteFetchWrapper({
      url: "passport/trails",
      queryString,
      //Important to reset the offset state to 0 when a new search is initiated
      queryKey: ['passport-trails', searchTerm],
      tableProps: {
         data: [],
         headers: tableHeaders
      }
   })

   return (
      <>
         <div className="px-8 pb-4 flex justify-between">
            <Search
               placeholder={`Search Staff ID`}
               search={setSearchTerm}
               refetch={queryData.refetch}
               isLoading={queryData.isLoading}
            />
            {
               queryData.data?.length ?
                  <ExportToExcel
                     data={queryData.data}
                     headers={tableHeaders}
                     filename='login-audit'
                  />
                  : null
            }
         </div>
         <div className="px-8 flex-1 overflow-y-hidden">
            {queryData.Table}
         </div>
      </>
   )
}
