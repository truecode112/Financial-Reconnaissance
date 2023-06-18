import { useEffect, useRef } from 'react';
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { useToast } from '../contexts/Notification.context';
import { cx, sanitizeUnsafeText } from '../lib/utils';
import Button from './Button';
import { buttonHeight } from '@/lib/config';

interface Props {
   search: (args: any) => void,
   isLoading?: boolean,
   refetch?: () => void,
   placeholder?: string
}
export default function Search({ search, isLoading, refetch, placeholder }: Props) {
   const inputRef = useRef<HTMLInputElement>(null)
   const { notify } = useToast()
   const prevSearchTerm = useRef("")

   function handleSearch(e: React.ChangeEvent<HTMLFormElement>) {
      e.preventDefault()
      const searchTerm = new FormData(e.target).get('search') as string
      try {
         const sanitizedString = sanitizeUnsafeText(searchTerm)
         if (!isLoading && searchTerm.length) {
            // If both are the same then a refetch has been requested with the same searchTerm
            if (prevSearchTerm.current === searchTerm) {
               refetch?.()
            } else {
               search(sanitizedString)
            }
         }
         // Keep a copy of current value
         prevSearchTerm.current = searchTerm

      } catch (error: any) {
         notify({
            message: error.message,
            variant: "error"
         })
      }
   }

   useEffect(() => {
      inputRef.current?.focus()
   }, [])

   return (
      <form onSubmit={handleSearch} className="w-full max-w-lg flex space-x-2">
         <div
            className={cx(
               buttonHeight,
               "flex flex-1 bg-white border border-gray-300 rounded-lg items-center overflow-hidden"
            )}
         >
            <span className="grid place-items-center pl-3" aria-label="search-icon">
               <FiSearch className="text-base text-gray-400" />
            </span>
            <input
               ref={inputRef}
               type="search"
               name="search"
               aria-label="search-input"
               placeholder={placeholder ?? `Search entries...`}
               autoComplete="off"
               className={cx(
                  "w-full flex-1 bg-transparent border-0 focus:ring-0",
                  "text-gray-600 placeholder-gray-400"
               )}
            />
         </div>
         <span>
            <Button
               name="search-button"
               type="submit"
               disabled={isLoading}
            >
               <span>Search</span>
               <FiArrowRight className="text-lg" />
            </Button>
         </span>
      </form>
   );
}