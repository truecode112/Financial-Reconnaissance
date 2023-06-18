import { motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { FiCheck, FiInfo, FiX } from 'react-icons/fi';
import { cx } from "../lib/utils";

interface ToastProps {
   message: string,
   id?: string,
   variant?: 'success' | 'error',
   close?(): void,
   duration?: number
}

interface ContextInterface {
   notify: (args: ToastProps) => void,
   deNotify: (id: string) => void
}

export const ToastContext = createContext({} as ContextInterface)
export const useToast = () => useContext(ToastContext)

export const ToastProvider = (props: { children: React.ReactNode }) => {
   const [toasts, setToasts] = useState<ToastProps[]>([])

   const notify: ContextInterface['notify'] = (args) => {
      setToasts(prv => {
         const id = String(Math.random()).slice(2)
         const payload: ToastProps[] = [
            ...prv,
            { ...args, id, duration: args.duration ?? 3000 }
         ]
         //Limit the number of toast that can be set.
         return prv.length < 2 ?
            groupToasts(payload) : payload
      })
   }

   function deNotify(id: string) {
      const newQueue = toasts.filter(toast => toast.id !== id)
      setToasts(newQueue)
   }

   return (
      <ToastContext.Provider value={{ notify, deNotify }}>
         {props.children}
         <ul
            style={{ zIndex: 999 }}
            className={`w-full max-w-md absolute top-20 right-8 space-y-4`}
         >
            {
               toasts?.map(toast =>
                  <Toast
                     {...toast}
                     key={toast.id}
                     close={() => deNotify(toast.id!)}
                  />
               )
            }
         </ul>
      </ToastContext.Provider>
   );
}

function Toast({ message, variant, close, duration }: ToastProps) {
   const closeRef = useRef(close)
   closeRef.current = close

   useEffect(() => {
      const timer = setTimeout(() => closeRef.current?.(), duration);
      return () => clearTimeout(timer)
   }, [duration]);

   const { styles, icon } = getStyles(variant)

   return (
      <motion.li
         // positionTransition
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className={cx(
            'p-4 py-3 text-sm w-full flex items-center space-x-3 rounded-lg shadow-lg',
            styles
         )}
      >
         {icon}
         <p className={`flex-1 truncate`}>{message}</p>
         <div className="h-full grid place-items-center" onClick={close}>
            <FiX className="text-2xl cursor-pointer" />
         </div>
      </motion.li>
   )
}

function getStyles(variant: ToastProps['variant']) {
   switch (variant) {
      case "error":
         return {
            styles: "bg-red-500 text-white",
            icon: <FiInfo className="text-2xl" />
         }
      default:
         return {
            styles: "bg-blue-500 text-white",
            icon: <div className="rounded-full border border-blue-50 text-white p-1">
               <FiCheck className="text-xl" />
            </div>
         }
   }
}

function groupToasts(toasts: ToastProps[]) {
   const hash = toasts.reduce((acc, toast) => {
      acc[toast.message] = toast
      return acc
   }, {} as Record<string, ToastProps>)

   return Object.values(hash)
}