import { Transition } from '@headlessui/react'
import { useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { IconType } from 'react-icons'
import { FiSearch } from 'react-icons/fi'
import { useToast } from '../contexts/Notification.context'
import { cx, databaseKeyMapper, queryStringFromObject, sanitizeUnsafeText } from '../lib/utils'
import Button from './Button'
import { FormData } from "./FormComponents"

export interface SearchFormProps {
   data: _SearchFormInput[],
   search: (query: string, values: _Object) => void,
   trigger?: (open: () => void) => React.ReactNode
   refetch(): void,
   label?: string,
   icon?: IconType
   setFormValues?: (arg: _Object) => void,
   callback?(arg: _Object): void,
   transformer?: (val: _Object) => _Object
   actionButtonText?: string
   alignment?: 'left' | 'right'
}

export default function SearchForm({ label = "Search records", actionButtonText = "search", ...props }: SearchFormProps) {
   const { notify } = useToast()
   const defaultValues = useRef({})
   const [isOpen, setIsOpen] = useState(false)
   const { handleSubmit, register, formState: { errors } } = useForm()
   const Icon = props.icon ?? FiSearch

   const open = () => {
      if (!isOpen) setIsOpen(true)
   }
   const close = () => {
      if (isOpen) setIsOpen(false)
   }

   function onSubmit(values: _Object) {
      let mappedValues: _Object = {}, query;

      try {
         if (values["first_6"] && values["last_4"]) {
            // Both should be merged into pan field. 
            // Important to delete unused keys after
            values["pan"] = values["first_6"] + values["last_4"]
            delete values["first_6"]
            delete values["last_4"]
         }

         // Map keys to db equivalents
         for (const key in values) {
            mappedValues[databaseKeyMapper(key)] = values[key]
         }

         mappedValues = props.transformer?.(mappedValues) ?? mappedValues
         query = queryStringFromObject(mappedValues)
         sanitizeUnsafeText(query) //will throw if Error

         //Nothing has changed but the button was clicked. Trigger refetch...
         const shouldRefetch = queryStringFromObject(defaultValues.current) === queryStringFromObject(values)

         if (shouldRefetch) {
            props.refetch()
         } else {
            props.search(query, values)
            props.setFormValues?.(mappedValues)
         }

         defaultValues.current = values
         if (props.callback) {
            props.callback(values)
            defaultValues.current = {}
            close()
         }
         if (query) close()

      } catch (error: any) {
         notify({
            message: error.message,
            variant: "error"
         })
      }
   }

   return (
      <div className="w-full">
         {
            props.trigger?.(open) ??
            <Button name="dropdown-open" className="shadow" onClick={open}>
               <Icon className="text-red-200 text-xl" /><span>{label}</span>
            </Button>
         }
         <DropdownWrapper
            isOpen={isOpen}
            close={close}
            alignment={props.alignment}
         >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
               {
                  <FormData
                     data={props.data}
                     defaultValues={defaultValues}
                     register={register}
                     errors={errors}
                  />
               }
               <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                     variant="transparent"
                     onClick={close}
                     fullWidth
                  >Close</Button>
                  <Button
                     type="submit"
                     fullWidth
                  >
                     {actionButtonText}
                  </Button>
               </div>
            </form>
         </DropdownWrapper>
      </div>
   )
}

interface DropdownWrapperProps {
   children: React.ReactNode,
   isOpen: boolean,
   close(): void
   alignment: SearchFormProps['alignment']
}
function DropdownWrapper(props: DropdownWrapperProps) {
   return (
      <div className="relative z-50">
         <Transition
            show={props.isOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-75"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-75"
         >
            <div className={cx(
               'w-[350px] absolute overflow-y-auto scrollbar mt-2 -top-14',
               props.alignment === 'right' ? 'right-0 origin-top-left' : 'left-0 origin-top-right',
               'border overflow-hidden border-slate-400 rounded-lg py-4 px-5',
               'bg-gradient-to-br from-red-50 via-white to-white',
               'shadow-xl shadow-red-100'
            )}>
               {props.children}
            </div>
         </Transition>
      </div>
   );
}
