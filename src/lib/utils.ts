import { format } from 'date-fns'
import { jsPDF } from "jspdf"
import { useEffect, useRef } from "react"

export function slugify(str: string) {
   if (str) return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ') //replace all non alphanumeric characters with whitespace
      .split(' ') //convert to array, because there will be cases of multiple whitespaces
      .filter(t => !!t) //remove any item in the array that's empty (whitespace)
      .join("-") //join items together into a string with hyphen
}

export function passwordify(str: string) {
  if (str) return str
    .replace(/./g, '*')
}

export const cx = (...args: (string | boolean | undefined)[]) => args.join(" ")

export function queryStringFromObject(obj: _Object) {
   let query = ''
   for (const key in obj) {
      if (obj[key]) {
         query += `${key}=${obj[key]}&`
      }
   }
   return query.slice(0, -1) //remove the last '&' character
}

export function tableEntryMapper(name: string, data: _Object) {
   switch (name) {
      case "issuer": return data["isOnUs"] ? "On us" : "Not on us"
      case "fep": return data["isFep"] ? "Available" : "NA"
      case "cba": return data["isCba"] ? "Available" : "NA"
      case "terminal_id": return data["terminalID"] ?? data["terminalId"] ?? data[name]
      case "pan": return data["panNumber"]
      case "sqn": return data["sequenceNumber"] ?? data["seqNumber"]
      case "hardware_error": return data["hardwareError"]
      case "auto-reversed": return data["isAutoReversed"] ? "Yes" : "No"
      case "ownership": return data["claim"]
      case "account_number": return data["accountNum"] ?? data["accountNumber"]
      case "till_account": return data["tillAccount"]
      case "settlement_account": return data["settlementAccount"]
      case "last_cash_added": return data["count"]
      case "ip_address": return data["ipAddress"]
      case "sol_id": return data["solId"] ?? data["solID"]
      case "short_name": return data["shortName"]
      case "username":
      case "staff_id": return data["username"] ?? data["userName"]
      case "image_link": return data["imageKey"]
      case "image_name": return data["fileName"]
      default:
         return data[name] ?? "";
   }
}

export function databaseKeyMapper(name: string) {
   switch (name) {
      case "terminal_id": return "terminalID"
      case "sequence_number": return "sqn"
      case "account_number": return "accountNum"
      case "hardware_error": return "hardwareError"
      case "till_account": return "tillAccount"
      case "settlement_account": return "settlementAccount"
      case "date_from": return "dateFrom"
      case "date_to": return "dateTo"
      case "exception": return "type"
      case "amount_evacuated": return "count"
      default: return name;
   }
}

export function formatDataToCSV(data: _Object[], headers: _TableHeader[]) {
   const formattedHeaders = headers.map(h => (h.key ?? h.label).replace(/_/gi, " ").toUpperCase())
   const formattedData = data?.map(d => {
      return headers.map(h => String(tableEntryMapper(h.key ?? h.label, d)))
   })
   return { formattedData, formattedHeaders }
}

interface TextToPDFProps {
   text: string,
   filename: string,
   fontSize?: number
   orientation?: 'portrait' | 'landscape'
}
export function textToPDF({ orientation = "portrait", filename = "export", ...props }: TextToPDFProps) {
   // const date = format(new Date(), "dd-MM-yy-hhmmss")
   const padding = 20
   // Default export is a4 paper, portrait, using millimeters for units
   const doc = new jsPDF({
      orientation,
      unit: "px"
   })
   //@ts-ignore
   const pageHeight = doc.getPageHeight()
   //@ts-ignore
   const pageWidth = doc.getPageWidth()
   const content = doc.splitTextToSize(props.text, pageWidth - padding)
   doc.setFontSize(props.fontSize ?? 9)
   doc.setLineHeightFactor(1.5)

   let x = padding, y = padding;
   content.forEach((line: string) => {
      if (y + padding > pageHeight) {
         y = padding; //Reset lineheight
         doc.addPage();
      }
      doc.text(line, x, y)
      y += 10; //lineheight
   })

   doc.save(`${filename}`)
}

export function useLoadingMessage() {
   const messages = [
      `Approaching the Speedforce...`,
      // `Reticulating splines...`,
      // `Generating your dashboard...`,
      `Swapping time and space...`,
      `Spinning on the y-axis...`,
      `Tokenizing real life...`,
      `Summoning the internet...`,
      `Grabbing extra minions`,
      `Bending the spoon...`,
      `Counting forward from Infinity`,
      `Creating a time-loop inversion field`,
      `Spinning the wheels of fortune...`,
      `Counting backwards from Infinity`,
      `To the galaxies and beyond..`,
      `Solving calculus...`,
   ]
   const index = useRef(Math.random())
   const mult = (num: number) => Math.floor(num * messages.length)

   return messages[mult(index.current)]
}

export function formatDate(dateString: string, formatString?: string) {
   try {
      const date = new Date(dateString)
      return format(date, formatString ?? `MM/dd/yy`)
   } catch (error) {
      return dateString
   }
}

export function formatDateTime(dateString: string, formatString?: string) {
   try {
      const date = new Date(dateString)
      return format(date, formatString ?? `MMM dd, yyyy - hh:mmaa`)
   } catch (error) {
      return dateString
   }
}

export function sanitizeEntity(values: _Object, data: _Object[]) {
   let modifiedValues = { ...values }
   const modifiedData = data?.reduce?.((acc, curr) => {
      acc[curr.name] = curr
      return acc
   }, {})

   for (const key in modifiedValues) {
      const value = modifiedValues[key]
      if (value.length) {
         if (["NULL", "Null", "null"].includes(value)) {
            modifiedValues[key] = null
         } else {
            modifiedValues[key] = modifiedData[key]?.modifier?.(value) ?? value
         }
      } else modifiedValues[key] = null
   }

   return modifiedValues
}

export function sanitizeUnsafeText(str: string, stripUnsafeText?: boolean) {
   let sanitized = str

   if (typeof str === "string") {
      let string = decodeURIComponent(str),
         startTag = `<script>`,
         endTag = `</script>`,
         tag;

      const isUnsafe = [startTag, endTag, `<img src=`, `<script/>`, `<script src`].some(el => {
         if (string.includes(el)) {
            tag = el
            return true
         }
         return false
      })

      if (isUnsafe) {
         if (stripUnsafeText) {
            const textToRemove = string.substring(string.indexOf(startTag) + startTag.length, string.indexOf(endTag))
            sanitized = [textToRemove, startTag, endTag, `< img`, ` < script /> `].map(el => string.replace(el, "")).join("")
            return sanitized
         }
         throw new Error(`Unsafe text "${tag}..." detected!`)
      }
   }
   return sanitized
}

export function sanitizeNumberInput(val: string) {
   if (val) return Number(String(val).replace(/\D/g, ''))
   return ''
}

export function useInterval(callback: Function, delay = 1000) {
   const savedCallback = useRef<Function>()

   useEffect(() => {
      savedCallback.current = callback
   }, [callback])

   useEffect(() => {
      const tick = () => savedCallback.current?.()
      if (delay !== null) {
         const counter = setInterval(tick, delay)
         return () => clearInterval(counter)
      }
      //eslint-disable-next-line
   }, [delay])
}

export function toSelectOptions<T>(arr: T[], modifier?: (arg: T) => string) {
   return arr?.reduce?.((acc, curr) => {
      const value = modifier?.(curr) ?? curr
      !!value && acc.push({ label: value as string, value })
      return acc
   }, [] as _SelectInputOption[])
}