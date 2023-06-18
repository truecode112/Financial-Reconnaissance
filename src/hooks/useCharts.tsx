import Button from "@/components/Button"
import MenuList, { _MenuList } from "@/components/MenuList"
import SearchForm, { SearchFormProps } from "@/components/SearchForm"
import { DefaultChartProps, chartSearchFormInputs, replacer } from "@/hooks/chart.utils"
import { formatNumber, metricPrefix } from "@/lib/numbers"
import { cx, formatDataToCSV } from "@/lib/utils"
import { format } from "date-fns"
import React from "react"
import { CSVLink } from "react-csv"
import { FiMoreVertical, FiRotateCw, FiSearch } from "react-icons/fi"
import { HiDownload, HiOutlineCursorClick } from "react-icons/hi"
import { CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

interface CustomTooltip {
   active: boolean
   payload: _Object[]
   label: string
   xAxisKey: string
}
export function CustomTooltip(props: CustomTooltip) {
   const isDate = props.xAxisKey.match(/date/gi)

   if (!props.label || !props.active) return null

   const label = isDate ?
      format(new Date(props.label), 'eee MMM d, YYY - hh:mma') :
      replacer(props.label)

   return (
      <div
         className={cx(
            "p-2 px-4 border border-slate-300 bg-white",
            "rounded-md shadow-2xl capitalize space-y-2"
         )}
      >
         <p className="text-sm text-slate-500">
            {label}
         </p>
         <hr />
         {
            props.payload.map(pl => (
               <p
                  key={pl.name}
                  style={{ color: pl.color }}
               >
                  <span>{replacer(pl.name)}</span>
                  {": "}
                  <span className="font-bold">
                     {formatNumber(pl.value)}
                  </span>
               </p>
            ))
         }
      </div>
   )
}

export function chartComponents(legends: string[], xAxisKey: string, colors: Color[]) {
   return (
      <React.Fragment>
         <defs>
            {
               legends.map((legend, i) => (
                  <linearGradient key={legend} id={legend} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={colors[i]} stopOpacity={0.8} />
                     <stop offset="95%" stopColor={colors[i]} stopOpacity={0} />
                  </linearGradient>
               ))
            }
         </defs>
         <XAxis
            dataKey={xAxisKey}
            tickFormatter={d => format(new Date(d), 'MMM dd')}
            axisLine={false}
            tickMargin={15}
            fontSize={10}
         />
         <YAxis
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={n => metricPrefix(n)}
            fontSize={12}
         />
         <CartesianGrid strokeDasharray="3 3" />
         <Tooltip
            content={
               <CustomTooltip
                  xAxisKey={xAxisKey}
                  {...{} as any}
               />
            }
         />
      </React.Fragment>
   )
}

interface LegendsProps extends Pick<DefaultChartProps<any>, 'options'> {
   selection: string[]
   setSelection: (sel: LegendsProps['selection']) => void
   colors: Color[]
}
export function Legends(props: LegendsProps) {

   function onClick(legend: string) {
      let newSelection = []
      const selected = props.selection.includes(legend)
      if (selected) {
         newSelection = props.selection.filter(s => s !== legend)
      } else if (props.selection.length > 1) {
         newSelection = props.selection.slice(1).concat(legend)
      } else {
         newSelection = props.selection.slice().concat(legend)
      }
      props.setSelection(newSelection)
   }

   return (
      <div className="flex items-center space-x-2 overflow-hidden">
         {
            props.options.legends.map((legend, i) => {
               const selected = props.selection.includes(String(legend))
               const formattedLegend = props.options.formattedLabels?.[legend] ?? replacer(String(legend))
               return (
                  <div
                     key={legend as string}
                     onClick={() => onClick(String(legend))}
                     className={cx(
                        "flex items-center space-x-1 p-1 cursor-pointer font-normal text-xs select-none",
                        selected ? 'border-b-2 border-slate-400' : 'text-slate-600'
                     )}
                  >
                     <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: props.colors[i] }}
                     ></span>
                     <p className="capitalize whitespace-nowrap">
                        {formattedLegend}
                     </p>
                  </div>
               )
            })
         }
         <span
            onClick={() => props.setSelection([])}
            className="grid place-items-center w-6 h-6 text-lg text-slate-500 cursor-pointer animate-pulse"
         >
            {
               props.selection.length ?
                  <HiOutlineCursorClick />
                  : null
            }
         </span>
      </div>
   )
}

interface FilterProps extends Pick<SearchFormProps, 'search' | 'alignment'> {
   searchFormInputs?: _SearchFormInput[]
}
export function FilterButton(props: FilterProps) {
   return (
      <SearchForm
         {...props}
         data={props.searchFormInputs ?? chartSearchFormInputs}
         refetch={() => null}
         actionButtonText="Get report"
         alignment={props.alignment ?? "right"}
         trigger={(open) => (
            <div className="flex justify-end">
               <Button
                  onClick={open}
                  variant="transparent"
                  className="!px-0 !text-slate-500 !text-lg"
               >
                  <FiSearch />
               </Button>
            </div>
         )}
      />
   )
}

export function MoreOptions(props: Pick<DefaultChartProps<_Object>, 'data' | 'exportHeaders' | 'filename' | 'refetch'>) {
   if (!props.data) return null

   const data = props.data ?? []
   const date = format(new Date(), "ddMMyy-hhmmss")
   const filename = replacer(props.filename, '_')
   const headers: _TableHeader[] = props.exportHeaders ?? Object.keys(data[0] ?? {}).map(k => ({ label: k }))
   const { formattedData, formattedHeaders } = formatDataToCSV(data, headers)

   const menulist: _MenuList[] = [
      {
         label: 'Refresh data',
         icon: FiRotateCw,
         onClick: props.refetch
      },
      {
         label: 'Download CSV',
         enabled: !!props.data?.length,
         render: (active) => {
            return (
               <div>
                  <CSVLink
                     data={formattedData}
                     headers={formattedHeaders}
                     filename={filename + "_" + date + ".csv"}
                     target="_blank"
                     className={cx(
                        "flex items-center space-x-2",
                        "whitespace-nowrap cursor-pointer px-3 py-2 space-x-3",
                        active ? 'bg-red-50 text-red-600' : 'text-slate-600'
                     )}
                  >
                     <HiDownload className="flex-shrink-0" />
                     <span>Download CSV ({data.length})</span>
                  </CSVLink>
               </div>
            )
         }
      },
   ]

   return (
      <MenuList
         header="header item"
         menuList={menulist}
      >
         <span className="flex p-1 px-0 text-slate-500">
            <FiMoreVertical className="text-xl" />
         </span>
      </MenuList>
   )
}