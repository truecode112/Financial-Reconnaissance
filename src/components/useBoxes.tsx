import { motion } from "framer-motion"
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react"
import { useFetch } from "../lib/fetch";
import { isValidNumber } from "@/lib/numbers";
import { cx } from "@/lib/utils";

type Props = {
   components: _BoxComponent[],
   size?: "small" | "default"
   baseURL?: "live" | "local" | "mastercard"
   isLoading?: boolean
}

export default function useBoxes({ size = "default", ...props }: Props) {
   const [index, setIndex] = useState(0)
   const Boxes = props.components.map((box, i) =>
      <Box
         key={box.title}
         box={box}
         index={i}
         size={size}
         tabIndex={index}
         setTabIndex={setIndex}
         baseURL={props.baseURL}
         isLoading={props.isLoading}
      />
   )

   const Tabs = (
      <div className="bg-white flex items-center h-10 border-b flex-shrink-0">
         {
            props.components.map((box, i) =>
               <Tab
                  box={box}
                  index={i}
                  key={box.title}
                  setIndex={setIndex}
                  isActive={i === index}
               />
            )
         }
      </div>
   )

   return {
      index: index,
      setIndex: setIndex,
      activeBox: props.components[index],
      Boxes,
      Tabs
   }
}

interface BoxProps extends Omit<Props, 'components'> {
   index: number,
   box: _BoxComponent
   tabIndex: number
   setTabIndex: Dispatch<SetStateAction<number>>
}
function Box(props: BoxProps) {
   const overflowRef1 = useRef<HTMLHeadingElement>(null)
   const overflowRef2 = useRef<HTMLHeadingElement>(null)

   const [showTooltip, setShowTooltip] = useState(false)
   const { title, icon: Icon, count, countUrl } = props.box
   const selected = props.index === props.tabIndex
   const isSmall = props.size === "small"

   const fetcher = useFetch<_Object>({
      queryKey: [props.box.title],
      url: countUrl as string,
      enabled: Boolean(count === undefined && countUrl),
      baseURL: props.baseURL
   })

   const displayCount = () => {
      if (!count && !countUrl) return

      let n = 0
      if (isValidNumber(count)) {
         n = count as number
      } else {
         n = fetcher.data?.count
      }

      return isValidNumber(n) ?
         n.toLocaleString?.("en-GB")
         : 0
   }

   const displayTooltip = useCallback(() => {
      //It is easier to check the parent div for overflow but the overflowing child elements are truncated hence never overflow the parent.
      const isOverflowing = [overflowRef1, overflowRef2].some(elem => {
         const width = elem.current!.clientWidth
         const scrollWidth = elem.current!.scrollWidth

         if (scrollWidth > width) return true
         return false
      })

      if (isOverflowing) {
         return (
            <motion.div
               initial={{ opacity: 0, top: 0 }}
               animate={{ opacity: 1, top: -30 }}
               className={cx(
                  'p-2 px-3 absolute z-[100] top-0 -right-3 bg-blue-50 border border-blue-300',
                  'rounded-md text-center capitalize shadow-lg',
                  'whitespace-nowrap text-center'
               )}
            >
               <p className="text-sm text-gray-500">{title}</p>
               <p>{displayCount()}</p>
            </motion.div>
         )
      }
      return null
   }, [fetcher.data, props.isLoading])

   const isLoading = props.isLoading ?? fetcher.isFetching

   return (
      <div
         key={title}
         onClick={() => props.setTabIndex?.(props.index)}
         onMouseEnter={() => !showTooltip && setShowTooltip(true)}
         onMouseLeave={() => showTooltip && setShowTooltip(false)}
         className={cx(
            "w-full max-w-md flex flex-col justify-between flex-shrink-0 cursor-pointer rounded-md relative",
            selected ? "bg-red-600 shadow-xl text-white" : "border border-red-400 border-dashed bg-white",
            isSmall ? "py-2 px-3" : "py-4 px-5",
            'min-h-[70px]'
         )}
      >
         <h3
            ref={overflowRef1}
            className={cx(
               isSmall ? "text-xs truncate" : "text-sm",
               selected ? "text-red-100" : "text-gray-400",
               "font-bold capitalize",
            )}
         >
            {title}
         </h3>
         <div
            className={cx(
               "flex items-center justify-between pt-2",
               selected ? "text-white" : "text-gray-600"
            )}
         >
            {
               Icon &&
               <Icon className={`text-xl opacity-50`} />
            }
            <h2
               ref={overflowRef2}
               className={cx(
                  "flex-1 items-end text-right font-bold space-y-1 truncate",
                  isSmall ? "text-xl" : "text-2xl"
               )}>
               {displayCount()}
            </h2>
         </div>
         {showTooltip && displayTooltip()}
         {
            !isLoading && props.box.url ?
               <span
                  className={cx(
                     "w-2 h-2 border  rounded-full ",
                     "absolute left-[-2px] top-[-2px]",
                     fetcher.isError ? "bg-red-200 border-red-400" : "bg-blue-200 border-blue-400",
                     isLoading && "animate-bounce"
                  )}></span>
               : null
         }
      </div>
   )
}

interface TabsProps {
   index: number
   box: _BoxComponent
   setIndex: Dispatch<React.SetStateAction<number>>
   isActive: boolean
}
function Tab(props: TabsProps) {
   return (
      <div
         onClick={() => props.setIndex(props.index)}
         data-testid={props.box.title}
         className={cx(
            'h-full grid place-items-center px-8 text-sm capitalize cursor-pointer select-none',
            props.isActive ?
               "bg-red-50 text-red-600 font-bold border-b border-red-600" :
               "text-gray-500"
         )}
      >{props.box.title}</div>
   )
}