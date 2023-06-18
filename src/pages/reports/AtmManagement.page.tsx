import { useState } from "react"
import { ExportToExcel } from "../../components/Button"
import SearchForm from "../../components/SearchForm"
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import { formatDateTime } from "../../lib/utils"

type Incident = 'faultyCamera' | 'connected' | 'allAtms'

const formInputs: _SearchFormInput[] = [
   { name: "date_from", type: "date", required: true },
   { name: "date_to", type: "date", required: true },
   { name: "terminal_id" },
   {
      type: "radio",
      name: "incident",
      options: [
         { name: "dark_image", value: "darkImage", checked: true },
         { name: "faulty_camera", value: "faultyCamera" },
         { name: "connected_terminals", value: "connectedTerminals" },
         { name: "disconnected_terminals", value: "disconnectedTerminals" },
         { name: "all_ATMs", value: "allAtms" },
      ]
   },
   {
      type: "radio",
      name: "region",
      options: [
         { name: "all", value: 0 },
         { name: "lagos_&_west", value: 1 },
         { name: "north", value: 2 },
         { name: "south", value: 3 }
      ]
   },
]

export default function AtmManagementpage() {
   const [url, setUrl] = useState<string>()
   const [queryString, setQueryString] = useState<string>()
   const [incident, setIncident] = useState<Incident>()

   const tableHeaders = getTableHeaders(incident)

   const request = useInfiniteFetchWrapper({
      url: url ?? '',
      queryKey: [queryString, url],
      enabled: Boolean(url && queryString),
      queryString,
      tableProps: {
         data: [],
         headers: tableHeaders,
      }
   })

   const transformer = (values: _Object) => {
      let url, incident: Incident;
      switch (values.incident) {
         case "faultyCamera": {
            url = "atms/faultyCamera"
            incident = "faultyCamera"
            break;
         }
         case "darkImage": {
            url = "atms/darkImage"
            break;
         }
         case "connectedTerminals": {
            url = "atms/terminals?status=1"
            incident = "connected"
            break;
         }
         case "disconnectedTerminals": {
            url = "atms/terminals?status=0"
            incident = "connected"
            break;
         }
         default: {
            url = "atms/terminals"
            incident = "allAtms"
            break;
         }
      }

      setUrl(url)
      //@ts-ignore
      setIncident(incident)
      delete values.incident
      return values
   }

   return (
      <div className="pt-8 pb-4 space-y-4 flex flex-col h-full overflow-y-auto scrollbar">
         <div className="px-8">
            <div className="flex justify-between">
               <SearchForm
                  data={formInputs}
                  search={setQueryString}
                  transformer={transformer}
                  refetch={request.refetch}
               />
               {
                  request.data?.length ?
                     <ExportToExcel
                        data={request.data}
                        headers={tableHeaders}
                        filename="reports-ATM-Management"
                     />
                     : null
               }
            </div>
         </div>
         <section className="px-8 flex-1 overflow-y-hidden">
            {request.Table}
         </section>
      </div >
   )
}

function getTableHeaders(incident?: Incident): _TableHeader[] {
   switch (incident) {
      case "connected":
         return [
            { label: "short_name" },
            { label: "sol_id" },
            { label: "ip_address" },
            { label: "terminal_id" },
            { label: "brand" },
            { label: "region" },
            { label: "state" },
            { label: "location" },
            { label: "branch" },
            {
               label: "date_updated",
               key: "date_Updated",
               modifier: date => formatDateTime(String(date))
            },
         ]

      case "allAtms":
         return [
            { label: "short_name" },
            { label: "sol_id" },
            { label: "ip_address" },
            { label: "terminal_id" },
            { label: "brand" },
            { label: "region" },
            { label: "state" },
            { label: "location" },
            { label: "branch" },
         ]

      case "faultyCamera":
         return [
            {
               label: "date",
               key: "modifiedDate",
               orderBy: true,
               sticky: true,
               modifier: date => formatDateTime(String(date))
            },
            { label: "sol_id" },
            { label: "terminal_id" },
            { label: "ip_address" },
            { label: "short_name" },
            { label: "branch" },
            { label: "state" },
            { label: "brand" },
            { label: "message", key: "description" },
         ]

      default:
         return [
            {
               label: "date",
               key: "timeStamp",
               orderBy: true,
               sticky: true,
               modifier: date => formatDateTime(String(date))
            },
            { label: "sol_id" },
            { label: "terminal_id" },
            { label: "ip_address" },
            { label: "short_name" },
            { label: "branch" },
            { label: "state" },
            { label: "brand" },
            { label: "message" },
         ]
   }
}

