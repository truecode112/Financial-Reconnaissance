import Spinner from "@/components/Spinner"
import { formatNumber } from "@/lib/numbers"
import { cx } from "@/lib/utils"
import { animate } from "framer-motion"
import React from "react"
import { DefaultChartProps, chartSearchFormInputs, replacer } from "./chart.utils"
import { FilterButton, MoreOptions } from "./useCharts"

interface CounterChartProps<T extends _Object> extends
   Pick<DefaultChartProps<T>, 'className' | 'filename' | 'options' | 'refetch' | 'searchForm'> {
   data: T
   title: string
   isLoading?: boolean
   textSize?: ClassName
   setFilters?: DefaultChartProps<T>['setFilters']
}
export default function CounterChart<T extends _Object>(props: CounterChartProps<T>) {
   const exportHeaders: _TableHeader[] = Object.keys(props.data ?? {}).map(k => ({ label: k }))

   return (
      <div className={cx(
         `space-y-4 bg-white p-5 py-4 rounded-lg border`,
         'hover:shadow-2xl hover:shadow-red-100',
         props.className,
      )}>
         <div className="flex items-center justify-between space-x-2">
            <p className="uppercase text-slate-500 text-md truncate">
               {props.title}
            </p>
            <div className="flex items-center space-x-1">
               <div className="flex-none">
                  {
                     props.isLoading ?
                        <Spinner
                           size="text-lg"
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
               <MoreOptions
                  data={[props.data]}
                  filename={props.filename}
                  exportHeaders={exportHeaders}
                  refetch={props.refetch}
               />
            </div>
         </div>
         <hr />
         {
            props.options.legends.map((key) => (
               <div key={key as string} className="capitalize space-y-1">
                  <NumberCounter
                     number={props.data?.[key] ?? 0}
                     textSize={props.textSize}
                  />
                  <p className="text-slate-400 text-sm">
                     {replacer((props.options.formattedLabels?.[key] ?? key) as string).toLowerCase()}
                  </p>
               </div>
            ))
         }
      </div>
   )
}
function NumberCounter(props: { number: number } & Pick<CounterChartProps<any>, 'textSize'>) {
   const nodeRef = React.useRef<HTMLParagraphElement>(null);

   React.useEffect(() => {
      const node = nodeRef.current;

      const controls = animate(0, props.number, {
         duration: 1.5,
         onUpdate(value) {
            if (node) {
               node.textContent = formatNumber(value)
            }
         }
      });

      return () => controls.stop();
   }, [props.number]);

   return <p className={props.textSize ?? 'text-5xl'} ref={nodeRef} />;
}