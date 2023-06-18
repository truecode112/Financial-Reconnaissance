import sampleAnalytics from "@/devServer/sampleData/_sampleAnalytics";
import CounterChart from "@/hooks/CounterChart";
import ProgressChart from "@/hooks/ProgressChart";
import {
   ColorsV2,
   DefaultChartProps,
   formatProgressChartData,
   formatProgressChartDataRelative,
   getFormattedLabels
} from "@/hooks/chart.utils";
import useAreaChart from "@/hooks/useAreaChart";
import useBarChart from "@/hooks/useBarChart";
import { useFetch } from "@/lib/fetch";
import React from "react";

export default function OverviewPage() {
   const terminalsStatus = useTerminalStatus()
   const terminalStatusProgressData = formatProgressChartDataRelative(terminalsStatus.data, 'totalTerminals')

   return (
      <section className="p-8 pb-4 space-y-4 flex flex-col h-full overflow-y-scroll scrollbar">
         <div className="grid grid-cols-5 gap-4">
            <TerminalStatusCount />
            {terminalsStatus.Chart}
            <ProgressChart
               data={terminalStatusProgressData}
               isLoading={terminalsStatus.isLoading}
               title="terminals status count"
               options={terminalsStatus.options}
               colors={['bg-indigo-500', 'bg-indigo-100']}
            />
         </div>
         <hr />
         <div className="grid grid-cols-2 gap-4">
            <AttemptedTransactions />
            <TopPerformingTerminals />
         </div>
         <hr />
         <div className="grid grid-cols-4 gap-4">
            <TotalBranches />
            <LowCashWarning />
         </div>
         <hr />
         <DarkImageCount />
         <br />
         <br />
      </section>
   )
}

function AttemptedTransactions() {
   const accessor: keyof typeof sampleAnalytics = 'suspiciousTransactionsCount'
   type D = typeof sampleAnalytics[typeof accessor]['data']
   const [filters, setFilters] = React.useState<string>()

   const fetcher = useFetch<D[]>({
      queryKey: ['suspicious_transactions', filters],
      url: sampleAnalytics[accessor].url + `?${filters}`,
   })

   const attemptedTransactions = useBarChart({
      xAxisKey: 'transactionDate',
      filename: accessor,
      colors: ColorsV2,
      data: fetcher.data,
      setFilters,
      options: {
         legends: ['totalAttemptedTransactions'],
         formattedLabels: {
            'totalAttemptedTransactions': 'suspicious transactions'
         }
      },
      isLoading: fetcher.isFetching,
      refetch: fetcher.refetch
   })

   return attemptedTransactions.Chart
}

function TerminalStatusCount() {
   const [filters, setFilters] = React.useState<string | undefined>('duration=0')
   const accessor: keyof typeof sampleAnalytics = 'terminal_status_count'
   type D = typeof sampleAnalytics[typeof accessor]['data']

   const legends: (keyof D)[] = ['Transaction In Progress', 'IDLE', 'Supervisor', 'Offline']
   const url = sampleAnalytics[accessor].url + '?' + filters
   const searchFormInputs: _SearchFormInput[] = [
      {
         name: 'duration',
         type: 'radio',
         options: [
            { name: 'daily', value: 0, checked: true },
            { name: 'weekly', value: 1 },
            { name: 'monthly', value: 2 },
            { name: 'yearly', value: 3 },
         ]
      }
   ]

   const fetcher = useFetch<D>({
      queryKey: [accessor, filters],
      url
   })

   return (
      <CounterChart
         title='terminal status'
         data={fetcher.data}
         filename={accessor}
         isLoading={fetcher.isFetching}
         options={{ legends }}
         textSize="text-4xl"
         className="!space-y-2"
         refetch={fetcher.refetch}
         setFilters={setFilters}
         searchForm={{
            inputs: searchFormInputs,
            alignment: 'left'
         }}
      />
   )
}

function useTerminalStatus() {
   type Options = DefaultChartProps<D>['options']
   const accessor: keyof typeof sampleAnalytics = 'terminalCountReport'
   type D = typeof sampleAnalytics[typeof accessor]['data']
   const [filters, setFilters] = React.useState<string>()

   const url = sampleAnalytics[accessor].url + `?${filters}`
   const options: Options = {
      legends: [
         'totalTerminals', 'totalOnlineTerminals',
         'totalOfflineTerminals', 'totalTerminalJournalPosted'
      ],
      formattedLabels: {
         'totalTerminals': 'terminals',
         'totalOnlineTerminals': 'online',
         'totalOfflineTerminals': 'offline',
         'totalTerminalJournalPosted': 'posting journals'
      }
   }

   const fetcher = useFetch<D[]>({
      queryKey: [accessor, filters],
      url
   })

   const terminalsStatus = useAreaChart({
      xAxisKey: 'transactionDate',
      data: fetcher.data,
      setFilters,
      options,
      filename: accessor,
      isLoading: fetcher.isFetching,
      colors: ColorsV2,
      className: 'col-span-3',
      refetch: fetcher.refetch
   })

   return {
      Chart: terminalsStatus.Chart,
      data: fetcher.data,
      isLoading: fetcher.isFetching,
      options,
      refetch: fetcher.refetch
   }
}

function TopPerformingTerminals() {
   const [filters, setFilters] = React.useState<string>()
   const accessor: keyof typeof sampleAnalytics = 'performances'
   type D = typeof sampleAnalytics[typeof accessor]['data']

   const url = sampleAnalytics[accessor].url + '?' + filters

   const fetcher = useFetch<D>({
      queryKey: [accessor, filters],
      url
   })

   const topHighPerforming = formatProgressChartData({
      id: 'terminalID',
      accessor: 'metrics',
      data: fetcher.data?.topPerformances ?? [],
      useSelfMaxValue: true
   })
   const topLowPerforming = formatProgressChartData({
      id: 'terminalID',
      accessor: 'metrics',
      data: fetcher.data?.lowestPerformances ?? [],
      useSelfMaxValue: true
   })

   const footer = (terminal: _Object) => (
      <p className="text-slate-500 text-xs mt-1">
         {terminal.payload.location}
      </p>
   )

   return <div className="grid grid-cols-2 gap-4">
      <ProgressChart
         title='Top 5 high performing terminals'
         data={topHighPerforming}
         exportData={fetcher.data?.topPerformances}
         colors={['bg-teal-500', 'bg-teal-100']}
         isLoading={fetcher.isFetching}
         refetch={fetcher.refetch}
         setFilters={setFilters}
         renderFooter={footer}
      />
      <ProgressChart
         title='Top 5 low performing terminals'
         data={topLowPerforming}
         exportData={fetcher.data?.lowestPerformances}
         colors={['bg-red-500', 'bg-red-100']}
         isLoading={fetcher.isFetching}
         refetch={fetcher.refetch}
         renderFooter={footer}
      />
   </div>
}

function TotalBranches() {
   const [filters, setFilters] = React.useState<string>()
   const accessor: keyof typeof sampleAnalytics = 'branchLoginCount'
   type D = typeof sampleAnalytics[typeof accessor]['data']

   const keys: (keyof D)[] = ['totalBranches', 'noOfLoginBranches', 'noOfNotLoginBranches']
   const url = sampleAnalytics[accessor].url + '?' + filters

   const fetcher = useFetch<D>({
      queryKey: [accessor, filters],
      url
   })

   return (
      <CounterChart
         title='branch login count'
         data={fetcher.data}
         filename="total_branches"
         isLoading={fetcher.isFetching}
         refetch={fetcher.refetch}
         setFilters={setFilters}
         options={{
            legends: keys,
            formattedLabels: {
               'noOfLoginBranches': 'branches logged in',
               'noOfNotLoginBranches': 'branches not logged in',
               'totalBranches': 'total branches'
            }
         }}
      />
   )
}

function LowCashWarning() {
   const [filters, setFilters] = React.useState<string>()
   const accessor: keyof typeof sampleAnalytics = 'low_cash_warning'
   type D = typeof sampleAnalytics[typeof accessor]['data']

   const url = sampleAnalytics[accessor].url + '?' + filters

   const fetcher = useFetch<D[]>({
      queryKey: [accessor],
      url
   })

   const lowCashWarning = useAreaChart({
      data: fetcher.data,
      xAxisKey: 'savedDate',
      className: 'col-span-3',
      filename: 'low_cash_warning',
      isLoading: fetcher.isFetching,
      refetch: fetcher.refetch,
      setFilters,
      options: {
         legends: ['lowCashWarningCount'],
         formattedLabels: getFormattedLabels(['lowCashWarningCount'])
      }
   })

   return lowCashWarning.Chart
}

function DarkImageCount() {
   const accessor: keyof typeof sampleAnalytics = 'terminalDarkImageCount'
   type D = typeof sampleAnalytics[typeof accessor]['data']
   const legends: Partial<keyof D>[] = ['totalOnlineTerminals', 'totalImages', 'totalDarkImages']
   const [filters, setFilters] = React.useState<string>()
   const url = sampleAnalytics[accessor].url + `?${filters}`

   const fetcher = useFetch<D[]>({
      queryKey: [accessor, filters],
      url
   })

   const darkImageCount = useAreaChart({
      xAxisKey: 'transactionDate',
      data: fetcher.data,
      setFilters,
      filename: accessor,
      isLoading: fetcher.isFetching,
      refetch: fetcher.refetch,
      options: {
         legends,
         formattedLabels: {
            'totalDarkImages': 'terminals with dark images',
            'totalOnlineTerminals': 'terminals',
            'totalImages': 'total images',
         }
      },
   })

   return darkImageCount.Chart
}