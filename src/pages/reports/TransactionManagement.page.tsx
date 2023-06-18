import { ExportToExcel } from "@/components/Button"
import SearchForm from "@/components/SearchForm"
import Table from "@/components/Table"
import useBoxes from "@/components/useBoxes"
import sampleAnalytics from "@/devServer/sampleData/_sampleAnalytics"
import { DefaultChartProps, formatProgressChartDataRelative } from "@/hooks/chart.utils"
import useAreaChart from "@/hooks/useAreaChart"
import { queryLimit, useFetch } from "@/lib/fetch"
import { formatDate, formatDateTime } from "@/lib/utils"
import React, { ComponentProps, useState } from "react"
import FundsTransfer from "./FundsTransfer.page"
import SuccessfulTransactions from "./SuccessfulTransactions.page"
import { cashAuditHeaders } from "../cash_management/CashAudit.page"
import ProgressChart from "@/hooks/ProgressChart"

const components: _BoxComponent[] = [
   { title: "Exceptions", component: TransactionManagement },
   { title: "Successful Transactions", component: SuccessfulTransactions },
   { title: "Funds Transfer", component: FundsTransfer },
]

export default function Page() {
   const boxes = useBoxes({ components })
   const ActiveComponent = components[boxes.index].component

   return (
      <div className="h-full flex flex-col">
         {boxes.Tabs}
         <div className="pt-4 pb-4 space-y-4 flex flex-col h-full overflow-y-auto scrollbar">
            <ActiveComponent />
         </div>
      </div>
   )
}

interface State {
   url?: string
   queryString?: string
   exception?: string
}
function TransactionManagement() {
   const [offset, setOffset] = useState(0)
   const [state, setState] = useState<State>({
      url: 'exceptions/report',
      queryString: undefined,
      exception: undefined
   })

   const search: ComponentProps<typeof SearchForm>['search'] = (queryString, values) => {
      let url = 'exceptions/report'
      if (values.exception === '5') { //cash-audit-count
         url = 'statistics/balancelist'
      } else if (['6', '7'].includes(values.exception)) {
         url = 'atms/nojournalpostings'
      }
      setState({
         url,
         queryString,
         exception: values.exception
      })
   }

   const fetcher = useFetch({
      queryKey: [`trx-management`, state.queryString, state.url],
      url: state.url + '?' + state.queryString,
      enabled: !!state.queryString,
   })

   const tableData = fetcher.data?.slice?.(0, (1 + offset) * queryLimit)
   const tableHeader = getTableHeader(state.exception)

   const chart = useChartData()
   const aggregated = formatProgressChartDataRelative(chart.data, 'totalTransactions')

   return (
      <>
         <div className="px-8">
            <div className="grid grid-cols-4 gap-4">
               {chart.Chart}
               <ProgressChart
                  title='aggregated'
                  data={aggregated}
                  colors={['bg-indigo-500', 'bg-indigo-50']}
                  isLoading={chart.isLoading}
                  options={chart.options}
               />
            </div>
            <div className="flex justify-between mt-6">
               <SearchForm
                  data={searchForm}
                  refetch={fetcher.refetch}
                  search={search}
               />
               {
                  fetcher.data?.length ?
                     <ExportToExcel
                        data={fetcher.data}
                        headers={tableHeader}
                        filename="reports-TransactionManagement"
                     />
                     : null
               }
            </div>
         </div>
         <div className="px-8">
            <Table
               data={tableData}
               headers={tableHeader}
               fetchMore={fetcher.data?.length > tableData?.length}
               setOffset={setOffset}
            />
         </div>
      </>
   )
}

function useChartData() {
   const [filters, setFilters] = React.useState<string>()
   const accessor: keyof typeof sampleAnalytics = 'reports__exceptions'
   type D = typeof sampleAnalytics[typeof accessor]['data']
   const url = sampleAnalytics[accessor].url + `?${filters}`
   const options: DefaultChartProps<D>['options'] = {
      legends: ['totalTransactions', 'totalOnUsCount', 'totalNotOnUsCount', 'totalDispenseErrorCount', 'totalUnImpactedCount'],
      formattedLabels: {
         'totalDispenseErrorCount': 'dispense error',
         'totalUnImpactedCount': 'unimpacted',
         'totalTransactions': 'transactions',
         'totalNotOnUsCount': 'not on us',
         'totalOnUsCount': 'on us',
      }
   }

   const fetcher = useFetch<D[]>({
      queryKey: [accessor],
      url
   })

   const chart = useAreaChart({
      data: fetcher.data,
      xAxisKey: 'transactionDate',
      filename: accessor,
      refetch: fetcher.refetch,
      isLoading: fetcher.isFetching,
      setFilters,
      className: 'col-span-3',
      options,
   })

   return {
      Chart: chart.Chart,
      data: fetcher.data,
      isLoading: fetcher.isFetching,
      options
   }
}

function getTableHeader(exceptionType?: string) {
   const value = parseInt(exceptionType as string)
   let result: _TableHeader[] = []

   switch (value) {
      case 2: {// Unimpacted
         result = [
            {
               label: "date",
               key: "transactionDate",
               sticky: true,
               modifier: date => formatDate(String(date))
            },
            { label: "terminal_id" },
            { label: "pan" },
            { label: "sqn" },
            { label: "rrn" },
            { label: "amount" },
            { label: "action" },
            { label: "issuer" },
            { label: "fep" },
            { label: "cba" },
            { label: "account_number" },
            { label: "settlement_account" },
            { label: "till_account" },
         ]
         break
      }
      case 3: {// Closed Dispense Error
         result = [
            {
               label: "date",
               key: "transactionDate",
               sticky: true,
               orderBy: true,
               modifier: date => formatDate(String(date))
            },
            { label: "terminal_id" },
            { label: "pan" },
            { label: "sqn" },
            { label: "rrn" },
            { label: "amount" },
            { label: "action" },
            { label: "issuer" },
            { label: "hardware_error" },
            { label: "account_number" },
            { label: "till_account" },
            { label: "ownership" },
         ]
         break
      }
      case 4: {// Closed Unimpacted
         result = [
            {
               label: "date",
               key: "transactionDate",
               sticky: true,
               orderBy: true,
               modifier: date => formatDate(String(date))
            },
            { label: "terminal_id" },
            { label: "pan" },
            { label: "sqn" },
            { label: "rrn" },
            { label: "amount" },
            { label: "action" },
            { label: "issuer" },
            { label: "fep" },
            { label: "cba" },
            { label: "account_number" },
            { label: "settlement_account" },
            { label: "till_account" },
            { label: "ownership" },
         ]
         break
      }
      case 5: {
         return cashAuditHeaders
      }
      case 6:
      case 7: {
         result = [
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
               label: "last post date",
               key: "date_Updated",
               modifier: date => formatDateTime(String(date))
            },
         ]
         return result
      }
      default: { // (1) Dispense Errors
         result = [
            {
               label: "date",
               key: "transactionDate",
               sticky: true,
               orderBy: true,
               modifier: date => formatDate(String(date))
            },
            { label: "terminal_id" },
            { label: "pan" },
            { label: "sqn" },
            { label: "rrn" },
            { label: "amount" },
            { label: "action" },
            { label: "issuer" },
            { label: "hardware_error" },
            { label: "account_number" },
            { label: "till_account" },
         ]
      }
   }

   return [
      ...result,
      { label: "sol_id" },
      { label: "region" },
   ]
}

const searchForm: _SearchFormInput[] = [
   { name: "date_from", type: "date", required: true },
   { name: "date_to", type: "date", required: true },
   { name: "terminal_id" },
   {
      name: "exception",
      type: "radio",
      options: [
         { name: "Dispense Error", value: 1 },
         { name: "Unimpacted", value: 2 },
         { name: "Closed Dispense Error", value: 3 },
         { name: "Closed Unimpacted", value: 4 },
         { name: "Cash Audit", value: 5 },
         { name: "Terminals Posting Journals", value: 6 },
         { name: "Terminals Not Posting Journals", value: 7 },
      ],
      required: true
   },
   {
      name: "issuer",
      type: "radio",
      options: [
         { name: "all", value: "" },
         { name: "on_us", value: 1 },
         { name: "not_on_us", value: 0 }
      ]
   },
]