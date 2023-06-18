import { SearchFormProps } from "@/components/SearchForm"
import { states } from "@/devServer/sampleData/sampleData"
import { getRandomInt, isValidNumber } from "@/lib/numbers"
import { formatDate } from "@/lib/utils"
import { subDays } from "date-fns"

export const Colors: Color[] = ['#5800FF', '#E900FF', '#26C6D0', '#928A97', '#F66060', '#26C6D0']
export const ColorsV2: Color[] = ['#ef4444', '#8971D0', '#28CC9E', '#FFCD00', '#643579', '#3B445B',]

export interface DefaultChartProps<T extends _Object> {
   data?: T[]
   xAxisKey: keyof T
   filename: string
   setFilters: SetState<string>
   options: {
      legends: (keyof T)[]
      formattedLabels?: Partial<Record<keyof T, string>>
   }
   searchForm?: {
      inputs?: _SearchFormInput[]
      alignment?: SearchFormProps['alignment']
   }
   refetch?(): void
   exportHeaders?: _TableHeader[]
   isLoading?: boolean
   height?: string | number
   className?: ClassName
   colors?: Color[]
}

interface FormatProgressDataProps<T, K extends keyof T> {
   data?: T[],
   id: keyof T,
   accessor: T[K] extends number ? K : never
   useSelfMaxValue?: boolean
}
/**
 * This function loops through a list of data points and measures against a single key, e.g object[accessor].
 * If useSelfMaxValue is true it uses the entry with the maximum object[accessor] value
 * as the yardstick for other entries.
 */
export function formatProgressChartData<T extends _Object, K extends keyof T>(props: FormatProgressDataProps<T, K>) {
   const lookup: Record<string, { value: number, percentage: number, payload: T }> = {}

   const accumulator = props.data?.reduce((acc, elem) => {
      const value = elem[props.accessor]
      if (props.id in lookup) {
         lookup[elem[props.id]].value += value
      } else {
         lookup[elem[props.id]] = {
            value,
            percentage: 0,
            payload: elem
         }
      }
      if (props.useSelfMaxValue) {
         if (value > acc) acc = value
      } else {
         acc += value
      }
      return acc
   }, 0) ?? 0

   for (const key in lookup) {
      const element = lookup[key]
      element.percentage = element.value / accumulator * 100
   }

   return Object.entries(lookup)
      .sort((a, b) => a[1].value < b[1].value ? 1 : -1)
}

/**
 * This function will loop through a list of data points and measure every entry against a unique key
 * that aggregates as the sole accumulator, e.g object[accessor]. 
 * Every entry in the object that has a value typeof number is aggregated.
 */
export function formatProgressChartDataRelative<T extends _Object, K extends keyof T>(
   data?: T[],
   accumulatorKey?: T[K] extends number ? K : never
) {
   const lookup: Record<string, { value: number, percentage: number, payload: T }> = {}

   const accumulator = data?.reduce((acc, elem) => {
      for (const key in elem) {
         const value = elem[key]
         if (isValidNumber(value)) {
            if (key in lookup) {
               lookup[key].value += value
            } else {
               lookup[key] = {
                  value,
                  percentage: 0,
                  payload: elem
               }
            }
         }
      }

      acc += elem[accumulatorKey as string]
      return acc
   }, 0) ?? 0

   for (const key in lookup) {
      const element = lookup[key]
      element.percentage = element.value / accumulator * 100
   }

   return Object.entries(lookup)
      .sort((a, b) => a[1].value < b[1].value ? 1 : -1)
}

export function formatBarChartData<T>(data: T[], name: keyof T) {
   const List: T[] = []

   for (const iterator of data) {
      const current: _Object = { name: iterator[name] }
      for (const key in iterator) {
         const value = iterator[key] as string | number
         if (isValidNumber(value)) {
            current[key] = value
         }
      }
      List.push(current as T)
   }

   return List
}

export const dataGenerator = {
   exceptions: (i: number) => ({
      transaction_date: subDays(new Date(), i).toISOString(),
      number_of_transactions: getRandomInt(4000, 5400),
      on_us: getRandomInt(1000, 5400),
      not_on_us: getRandomInt(1000, 5400),
      dispense_error: getRandomInt(1000, 5400),
      unimpacted: getRandomInt(1000, 5400),
   }),
   cash_audit: (i: number) => ({
      date: subDays(new Date(), i).toISOString(),
      terminals: getRandomInt(100, 2500),
      cash_loaded: getRandomInt(10_000_000, 55_000_000),
      withdrawal: getRandomInt(10_000_000, 200_000_000),
      available_cash: getRandomInt(20_000_000, 50_000_000),
      cash_evacuated: getRandomInt(20_000_000, 50_000_000),
   }),
   overview_terminals: (i: number) => ({
      transaction_date: subDays(new Date(), i).toISOString(),
      terminals: getRandomInt(1500, 2500),
      number_of_images: getRandomInt(500_000, 10_000_000),
      dark_images: getRandomInt(50, 2500),
      faulty_cameras: getRandomInt(50, 2500)
   }),
   overview_transactions: (i: number) => ({
      date: subDays(new Date(), i).toISOString(),
      transactions_with_lost_or_stolen_cards: getRandomInt(10, 2500),
   }),
   overview_total_branches: () => ({
      total_branches: getRandomInt(2000, 3000),
      total_branches_logged_in: getRandomInt(500, 2000),
      total_branches_not_logged_in: getRandomInt(100, 500),
   }),
   overview_top_performing: (i: number) => ({
      terminal_id: 'terminal' + (i + 1),
      location: states[i],
      total: getRandomInt(100, 1000),
   }),
   overview_low_cash_warning: (i: number) => ({
      transaction_date: subDays(new Date(), i).toISOString(),
      number_of_terminals_with_low_cash_warning: getRandomInt(100, 1000),
   }),
   overview_terminals_status: (i: number) => ({
      transaction_date: subDays(new Date(), i).toISOString(),
      number_of_terminals: getRandomInt(2500, 3000),
      number_of_terminals_offline: getRandomInt(100, 1000),
      number_of_terminals_online: getRandomInt(100, 2000),
      number_of_terminals_posting_journals: getRandomInt(100, 500),
   }),
}

export const replacer = (str: string, token = ' ') => str.replace(/[^a-zA-Z0-9]/g, token)

export function getExportHeaders(key: keyof typeof dataGenerator): _TableHeader[] {
   return Object.keys(dataGenerator[key](0)).map(el => ({
      label: el,
      modifier: el.match(/date/gi) ? (d) => formatDate(d) : undefined
   }))
}

export const chartSearchFormInputs: _SearchFormInput[] = [
   { name: "dateFrom", type: "date", required: true },
   { name: "dateTo", type: "date", required: true },
]

export function sectionTitle(title: string) {
   return (
      <h2 className="text-lg mb-3 capitalize text-slate-500">
         {title}
      </h2>
   )
}

export function getFormattedLabels(list: string[]) {
   return list.reduce((acc, key) => {
      const k = key.split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/).join(" ")
      acc[key] = k
      return acc
   }, {} as _Object)
}