import sampleAnalytics from "@/devServer/sampleData/_sampleAnalytics"
import useAreaChart from "@/hooks/useAreaChart"
import React from "react"
import Search from "../../components/Search"
import Table from "../../components/Table"
import { useFetch } from "../../lib/fetch"
import { DefaultChartProps, formatProgressChartDataRelative } from "@/hooks/chart.utils"
import ProgressChart from "@/hooks/ProgressChart"

export default function CashAudit() {
   const [searchTerm, setSearchTerm] = React.useState(null)

   const { isFetching, data, refetch } = useFetch<_Object>({
      queryKey: [`cash-audit`, searchTerm],
      url: `statistics/balance?terminalId=${searchTerm}`,
      enabled: !!searchTerm,
   })

   const chart = useCashAuditChart()
   const aggregated = formatProgressChartDataRelative(chart.data, 'totalCashLoaded')

   return (
      <div className="p-8 pb-4 space-y-8 overflow-y-auto scrollbar">
         <div className="grid grid-cols-4 gap-4">
            {chart.Chart}
            <ProgressChart
               data={aggregated}
               title='aggregated'
               colors={['bg-indigo-500', 'bg-indigo-50']}
               isLoading={chart.isLoading}
               options={chart.options}
            />
         </div>
         <div className="space-y-4">
            <Search
               placeholder="Search Terminal ID"
               search={setSearchTerm}
               isLoading={isFetching}
               refetch={refetch}
            />
            <Table
               headers={cashAuditHeaders}
               data={data ? [data] : []}
            />
         </div>
      </div>
   )
}

function useCashAuditChart() {
   const [filters, setFilters] = React.useState<string>()
   const accessor: keyof typeof sampleAnalytics = 'cash_audit__cash_audit_count'
   type D = typeof sampleAnalytics[typeof accessor]['data']
   const url = sampleAnalytics[accessor].url + `?${filters}`
   const options: DefaultChartProps<D>['options'] = {
      legends: ['totalTerminalCount', 'totalCashLoaded', 'totalCashAvailable', 'totalCashWithdrawal'],
      formattedLabels: {
         'totalCashAvailable': 'cash available',
         'totalCashLoaded': 'cash loaded',
         'totalCashWithdrawal': 'cash withdrawal',
         'totalTerminalCount': 'terminals'
      }
   }

   const fetcher = useFetch<D[]>({
      queryKey: [accessor],
      url
   })

   const cashAuditChart = useAreaChart({
      data: fetcher.data,
      xAxisKey: 'transactionDate',
      filename: accessor,
      refetch: fetcher.refetch,
      isLoading: fetcher.isFetching,
      className: 'col-span-3',
      setFilters,
      options
   })

   return {
      Chart: cashAuditChart.Chart,
      data: fetcher.data,
      isLoading: fetcher.isFetching,
      options
   }
}

export const cashAuditHeaders: _TableHeader[] = [
   { label: "terminal_id" },
   { key: "finacleBalance", label: "ledger_balance" },
   { key: "atmCashEvacuated", label: "cash_evacuated" },
   { key: "atmCashLoaded", label: "cash_added" },
   { key: "custEvac", label: "custodian_evacuated" },
   { key: "atmBalance", label: "current_atm_balance" },
   { key: "totalAmountWithdrawn", label: "total_cash_withdrawn" },
   { key: "difference", label: "balance_difference" }
]