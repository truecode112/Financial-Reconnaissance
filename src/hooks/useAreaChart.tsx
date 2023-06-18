import Spinner from "@/components/Spinner"
import { Colors, DefaultChartProps } from "@/hooks/chart.utils"
import { cx } from "@/lib/utils"
import React from "react"
import {
   Area, AreaChart,
   Line,
   LineChart, ResponsiveContainer
} from "recharts"
import { FilterButton, Legends, MoreOptions, chartComponents } from "./useCharts"

const margins = {
   top: 10,
   right: 15,
   left: 0,
   bottom: 10
}

export default function useAreaChart<T extends _Object>(props: DefaultChartProps<T>) {
   const colors = props.colors ?? Colors
   const [selection, setSelection] = React.useState<string[]>([])
   const legends = props.options.legends as string[]

   const isArea = legends.length < 3 || (selection.length < 3 && selection.length > 0)

   const Chart = (
      <div className={cx(
         "bg-white p-4 rounded-lg border border-slate-300",
         "shadow-xl shadow-slate-100 space-y-2",
         props.className
      )}>
         <div className="flex justify-between px-2">
            <Legends
               options={props.options}
               setSelection={setSelection}
               selection={selection}
               colors={colors}
            />
            <div className="flex justify-end items-center space-x-1">
               {
                  props.isLoading &&
                  <Spinner color="text-slate-400" />
               }
               <FilterButton search={props.setFilters} />
               <MoreOptions
                  data={props.data}
                  filename={props.filename}
                  exportHeaders={props.exportHeaders}
                  refetch={props.refetch}
               />
            </div>
         </div>
         <ResponsiveContainer
            width='100%'
            height={props.height ?? 300}
         >
            {
               isArea ?
                  <AreaChart
                     data={props.data}
                     margin={margins}
                  >
                     {chartComponents(legends, props.xAxisKey as string, colors)}
                     {
                        props.data?.map((_, i) => {
                           const key = legends[i]
                           if (selection.length && !selection.includes(key)) {
                              return null
                           }
                           return (
                              <Area
                                 key={key + i}
                                 type="linear"
                                 dataKey={String(key)}
                                 stroke={colors[i]}
                                 fill={`url(#${key})`}
                                 animationDuration={500}
                              />
                           )
                        })
                     }
                  </AreaChart>
                  :
                  <LineChart
                     data={props.data}
                     margin={margins}
                  >
                     {chartComponents(legends, props.xAxisKey as string, colors)}
                     {
                        props.data?.map((_, i) => {
                           const key = legends[i]
                           if (selection.length && !selection.includes(key)) {
                              return null
                           }
                           return (
                              <Line
                                 key={key + i}
                                 type="linear"
                                 dataKey={String(key)}
                                 stroke={colors[i]}
                                 fill={`url(#${key})`}
                                 animationDuration={500}
                              />
                           )
                        })
                     }
                  </LineChart>
            }
         </ResponsiveContainer>
      </div>
   )

   return {
      Chart,
      selection,
      setSelection,
      legends,
   }
}