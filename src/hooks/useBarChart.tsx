import Spinner from "@/components/Spinner"
import { Colors, DefaultChartProps } from "@/hooks/chart.utils"
import { cx } from "@/lib/utils"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { FilterButton, Legends, MoreOptions, chartComponents } from "./useCharts"

const margins = {
   top: 10,
   right: 30,
   left: 0,
   bottom: 10
}

export default function useBarChart<T extends _Object>(props: DefaultChartProps<T>) {
   const colors = props.colors ?? Colors
   const legends = props.options.legends as string[]

   const Chart = (
      <div className={cx(
         "bg-white p-4 rounded-lg border border-slate-300",
         "shadow-xl shadow-slate-100 space-y-2 flex flex-col justify-between",
         props.className
      )}>
         <div className="flex justify-between px-2">
            <Legends
               options={props.options}
               setSelection={() => null}
               selection={[]}
               colors={colors}
            />
            <div className="flex items-center space-x-1.5">
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
            height={props.height ?? 350}
            width='100%'
         >
            <BarChart
               data={props.data}
               margin={margins}
            >
               {chartComponents(legends, props.xAxisKey as string, colors)}
               {
                  legends.map((legend, i) => (
                     <Bar
                        key={legend + i}
                        dataKey={legend}
                        fill={`url(#${legend})`}
                        animationDuration={500}
                     />
                  ))
               }
            </BarChart>

         </ResponsiveContainer>
      </div>
   )

   return {
      Chart,
      legends,
      data: {}
   }
}