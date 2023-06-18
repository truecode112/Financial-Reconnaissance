import Spinner from "@/components/Spinner"
import { metricPrefix, formatNumber } from "@/lib/numbers"
import { cx } from "@/lib/utils"
import { motion } from "framer-motion"
import React from "react"
import { formatProgressChartData, DefaultChartProps, replacer, chartSearchFormInputs } from "./chart.utils"
import { FilterButton, MoreOptions } from "./useCharts"

interface ProgressChartProps extends Partial<Pick<DefaultChartProps<_Object>, 'options' | 'searchForm' | 'setFilters'>> {
   data?: ReturnType<typeof formatProgressChartData>
   title: string
   isLoading: boolean
   refetch?(): void
   exportData?: _Object[]
   renderFooter?: (data: ReturnType<typeof formatProgressChartData>[number][1]) => React.ReactNode
   colors?: [string, string]
}
export default function ProgressChart(props: ProgressChartProps) {
   const exportHeaders: _TableHeader[] = Object.keys(props.exportData?.[0] ?? {}).map((label) => ({ label }))
   const truncate = props.data?.some(d => d[1].value > 1e9)

   return (
      <div className="space-y-2 bg-white p-6 py-4 font-plex rounded-xl ring-1 ring-slate-300">
         <div className="flex items-center justify-between space-x-2 border-b pb-3 h-8">
            <p className="capitalize text-slate-600 truncate w-full">
               {props.title}
            </p>
            <div className="flex items-center space-x-2">
               <div className="flex-none">
                  {
                     props.isLoading ?
                        <Spinner
                           size="text-xl"
                           color="text-slate-400"
                        /> : null
                  }
               </div>
               {
                  props.setFilters &&
                  <FilterButton
                     search={props.setFilters}
                     alignment={props.searchForm?.alignment ?? 'left'}
                     searchFormInputs={props.searchForm?.inputs ?? chartSearchFormInputs}
                  />
               }
            </div>
            <MoreOptions
               data={props.exportData}
               filename={props.title}
               exportHeaders={exportHeaders}
               refetch={props.refetch}
            />
         </div>
         <React.Fragment>
            {
               props.data?.map(([key, value]) => {
                  return (
                     <div
                        key={key}
                        className={cx("text-sm space-y-0.5 py-0.5")}
                     >
                        <div className="flex justify-between capitalize truncate text-sm space-x-3">
                           <p className="truncate">
                              {replacer(props.options?.formattedLabels?.[key] ?? key)}
                           </p>
                           <p>
                              {
                                 truncate ? metricPrefix(value.value) :
                                    formatNumber(value.value)
                              }
                           </p>
                        </div>

                        <div
                           className={cx(
                              "flex items-center justify-between h-2 relative",
                              props.colors?.[1] ?? "bg-red-50"
                           )}
                        >
                           <motion.div
                              initial={{ width: '0%' }}
                              animate={{
                                 width: Math.min(100, value.percentage) + '%',
                                 transition: {
                                    type: 'tween',
                                    duration: 1
                                 }
                              }}
                              className={cx(
                                 "px-2 h-full rounded-r-sm flex items-center",
                                 "flex justify-end text-white",
                                 props.colors?.[0] ?? "bg-red-500"
                              )}
                           >
                           </motion.div>
                        </div>

                        <div className="flex space-x-3 justify-between">
                           {props.renderFooter?.(value)}
                           <p className="opacity-50 text-xs">
                              ({value.percentage.toFixed(1)}%)
                           </p>
                        </div>
                     </div>
                  )
               })
            }
         </React.Fragment>
      </div>
   )
}