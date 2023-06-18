import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { FiDownload } from 'react-icons/fi';
import { CSVLink } from "react-csv"
import { cx, formatDataToCSV } from '../lib/utils';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { replacer } from '@/hooks/chart.utils';
import { buttonHeight } from '@/lib/config';

interface ButtonProps {
   children?: React.ReactNode,
   name?: string,
   className?: string,
   onClick?: (arg?: any) => void,
   goto?: string,
   type?: "button" | "submit",
   textSize?: string,
   disabled?: boolean,
   fullWidth?: boolean,
   variant?: "light" | "dark" | "darker" | "light-blue" | "light-red" | "transparent"
   border?: string,
   loading?: boolean
}

export default function Button(props: ButtonProps) {
   const history = useHistory()

   function handleClick() {
      props.onClick?.()
      if (props.goto && typeof props.goto === "string") history.push(props.goto)
   }

   return (
      <motion.button
         whileTap={{ scale: 0.98 }}
         type={props.type ?? 'button'}
         name={props.name}
         aria-label={props.name}
         className={cx(
            props.className,
            getClasses({
               variant: props.variant,
               disabled: props.disabled,
               fullWidth: props.fullWidth
            })
         )}
         onClick={handleClick}
         disabled={props.disabled}
      >
         {props.children}
      </motion.button>
   )
}

interface ExportToExcelProps extends PropsWithChildren {
   data: _Object[]
   filename: string
   headers?: _TableHeader[]
   className?: ClassName
}
export function ExportToExcel(props: ExportToExcelProps) {
   const data = props.data ?? []
   const date = format(new Date(), "ddMMyy-hhmmss")
   const filename = replacer(props.filename, '_')
   const headers: _TableHeader[] = props.headers ?? Object.keys(props.data[0]).map(k => ({ label: k }))
   const { formattedData, formattedHeaders } = formatDataToCSV(data, headers)

   return (
      <motion.div
         initial={{ opacity: 0, x: -50 }}
         animate={{ opacity: 1, x: 0 }}
      >
         <CSVLink
            data={formattedData}
            headers={formattedHeaders}
            filename={filename + "_" + date + ".csv"}
            target="_blank"
            className={cx(
               "rounded-md focus:outline-red-300 whitespace-nowrap relative cursor-pointer",
               props.className ?? cx(
                  buttonHeight,
                  "px-4 bg-blue-50 flex items-center space-x-2",
                  "text-sm ring-1 ring-inset text-blue-600"
               )
            )}
         >
            {
               props.children ??
               <>
                  <FiDownload className="text-lg flex-shrink-0" />
                  <span>Export to Excel {data?.length ? `(${data.length})` : ""}</span>
               </>
            }
         </CSVLink>
      </motion.div>
   )
}

function getClasses(args: ButtonProps) {
   const defaultClass = cx(
      'h-8 px-4 outline-none rounded-md flex items-center hover:opacity-90',
      'space-x-2 whitespace-nowrap disabled:opacity-50 animated capitalize',
      !args.disabled ? "cursor-pointer" : "cursor-default",
      args.fullWidth ? "w-full max-w-md justify-center" : "max-w-min",
      'focus:outline-red-600/40',
   )
   const checkDisabled = (styles: string) => args.disabled ? styles + " opacity-50" : styles

   switch (args.variant) {
      case "light-blue":
         return `${defaultClass} bg-blue-50 border border-blue-200 text-blue-700`
      case "light-red":
         return `${defaultClass} bg-red-50 border border-red-200 text-red-700`
      case "light":
         return `${defaultClass} ${checkDisabled("bg-red-50 border border-red-200 text-red-700")}`
      case "dark":
         return `${defaultClass} ${checkDisabled("bg-red-500 text-white")}`
      case "darker":
         return `${defaultClass} ${checkDisabled("bg-red-800 text-red-100 focus:outline-slate-500/50")}`
      case "transparent":
         return `${defaultClass} bg-transparent text-red-500`
      default:
         return `${defaultClass} ${checkDisabled("bg-red-600 text-white")}`
   }
}