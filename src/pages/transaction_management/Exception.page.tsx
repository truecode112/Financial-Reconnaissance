import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiCheck, FiCornerLeftDown, FiLayers, FiShieldOff, FiWifiOff } from "react-icons/fi";
import Button from "../../components/Button";
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper";
import Spinner from "../../components/Spinner";
import { TableProps } from "../../components/Table";
import useBoxes from "../../components/useBoxes";
import { useToast } from "../../contexts/Notification.context";
import { useFetchClient } from "../../lib/fetch";
import { formatDate } from "../../lib/utils";

type RequestType = 'accept' | 'decline'

export default function ExceptionPage() {
   const fetchClient = useFetchClient()
   const queryClient = useQueryClient()
   const { notify } = useToast()

   //For spinner when either Accept or Decline is called
   const [requestType, setRequestType] = useState<RequestType>()
   const [selectedRows, setSelectedRows] = useState<_Object>({})
   const count = Object.keys(selectedRows).length

   const updateSelection: TableProps['updateSelection'] = (data, action) => {
      switch (action) {
         case "add": {
            if (data?.id !== undefined) {
               setSelectedRows(prevMap => ({ ...prevMap, [data.id]: data }))
            }
            break;
         }

         case "remove": {
            //on initial mount this will be called. Avoid unnecessary state update
            if (count > 0 && data) {
               const modifiedRows = { ...selectedRows }
               delete modifiedRows[data.id]
               setSelectedRows(modifiedRows)
            }
            break;
         }

         default: {
            //if called without arguments clear selection
            setSelectedRows({})
            break;
         }
      }
   }

   // const { data: totalDispenseError } = useFetch({ url: `exceptions/count?type=1`, enabled: true })
   // const { data: totalUnimpacted } = useFetch({ url: `exceptions/count?type=2`, enabled: true })
   // const { data: totalNetworkError } = useFetch({ url: `exceptions/count?type=5`, enabled: true })

   const components: _BoxComponent[] = [
      {
         title: "Dispense Error (Mechanical fault)",
         component: DispenseError,
         url: "exceptions/overages",
         postUrl: ["exceptions/accept", "exceptions/decline"],
         // count: totalDispenseError,
         icon: FiLayers
      },
      {
         title: "Unimpacted",
         component: Unimpacted,
         url: "exceptions/shortages",
         postUrl: ["exceptions/acceptunimpacted", "exceptions/decline"],
         // count: totalUnimpacted,
         icon: FiShieldOff
      },
      {
         title: "Dispense Error (Network fault)",
         component: NetworkError,
         url: "exceptions/skippedTransactions",
         postUrl: ["exceptions/acceptSkipped", "exceptions/declineSkipped"],
         // count: totalNetworkError,
         icon: FiWifiOff
      },
   ]

   const { index: boxIndex, Boxes } = useBoxes({ components })
   const { url, component: ActiveComponent } = components[boxIndex]
   const [acceptUrl, declineUrl] = components[boxIndex].postUrl!

   const { isLoading, mutate, reset } = useMutation({
      mutationFn: (args: { data: _Object, url: string }) => fetchClient.post(args.url, args.data),
      onSuccess: () => {
         notify({ message: "Request processed successfully" })
         queryClient.invalidateQueries([components[boxIndex].url])
         updateSelection()
         reset()
      },
      onError: (error: any) => {
         notify({
            message: "Error processing request",
            variant: "error"
         })
         console.error(error.message)
      }
   })

   function handleSubmit(url: string, type: RequestType) {
      const data = Object.values(selectedRows)
      if (!isLoading && data.length) {
         type && setRequestType(type)
         mutate({ data, url })
      }
   }

   return (
      <div className="pt-8 pb-4 space-y-8 flex flex-col h-full overflow-hidden">
         <div className="px-8 flex space-x-8 justify-between">
            <div className="grid grid-cols-3 gap-4">
               {Boxes}
            </div>

            <div className="space-y-2">
               <Button
                  disabled={!count || isLoading}
                  onClick={() => handleSubmit(acceptUrl, "accept")}
               >
                  {
                     isLoading && requestType === "accept" ?
                        <Spinner color="text-white" /> :
                        <FiCheck className="text-xl flex-shrink-0" />
                  }
                  <span>Accept All ({count})</span>
               </Button>
               <Button
                  variant={"light"}
                  disabled={!count || isLoading}
                  onClick={() => handleSubmit(declineUrl, "decline")}
               >
                  {
                     isLoading && requestType === "decline" ?
                        <Spinner color="text-red" /> :
                        <FiCornerLeftDown className="text-lg flex-shrink-0" />
                  }
                  <span>Decline All ({count})</span>
               </Button>
            </div>
         </div>
         <section className="px-8 flex-1 overflow-y-hidden">
            <ActiveComponent
               url={url}
               updateSelection={updateSelection}
            />
         </section>
      </div>
   )
}

interface TProps {
   updateSelection: TableProps['updateSelection']
   url: string
}
function DispenseError(props: TProps) {
   const tableHeaders: _TableHeader[] = [
      {
         label: "date",
         key: "transactionDate",
         orderBy: true,
         sticky: true,
         modifier: (date) => formatDate(String(date))
      },
      { label: "terminal_id", orderBy: true },
      { label: "pan" },
      { label: "sqn" },
      { label: "rrn" },
      { label: "amount" },
      { label: "action" },
      { label: "issuer" },
      { label: "hardware_error" },
      { label: "till_account" },
      { label: "account_number" },
   ]

   const infiniteData = useInfiniteFetchWrapper({
      url: props.url,
      queryKey: ['DispenseError'],
      tableProps: {
         claim: true,
         data: [],
         headers: tableHeaders,
         updateSelection: props.updateSelection
      }
   })

   return infiniteData.Table
}

function Unimpacted(props: TProps) {
   const tableHeaders: _TableHeader[] = [
      {
         label: "date",
         key: "transactionDate",
         orderBy: true,
         sticky: true,
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
      { label: "settlement_account" },
      { label: "till_account" },
      { label: "account_number" },
   ]

   const infiniteData = useInfiniteFetchWrapper({
      url: props.url,
      queryKey: ['DispenseError'],
      tableProps: {
         claim: true,
         data: [],
         headers: tableHeaders,
         updateSelection: props.updateSelection
      }
   })

   return infiniteData.Table
}

function NetworkError(props: TProps) {
   const tableHeaders: _TableHeader[] = [
      {
         label: "date",
         key: "captureDate",
         orderBy: true,
         sticky: true,
         modifier: date => formatDate(String(date))
      },
      { label: "terminal_id", orderBy: true },
      { label: "pan" },
      { label: "sqn", key: "seqNumber" },
      { label: "amount" },
      { label: "rrn" },
      { label: "issuer" },
      { label: "till_account" },
   ]

   const infiniteData = useInfiniteFetchWrapper({
      url: props.url,
      queryKey: ['DispenseError'],
      tableProps: {
         claim: true,
         data: [],
         headers: tableHeaders,
         updateSelection: props.updateSelection
      }
   })

   return infiniteData.Table
}