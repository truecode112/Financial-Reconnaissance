import { UseFormRegister } from "react-hook-form"
import { cx } from "../lib/utils"
import { buttonHeight } from "@/lib/config"

interface SelectProps {
   name: string,
   label?: string,
   width?: string,
   required?: boolean,
   initialValue?: string,
   onChange?: any,
   options?: _SelectInputOption[],
   register?: UseFormRegister<any>
   noLabel?: boolean
   errors?: _Object,
   acronym?: string,
}
export default function Select(props: SelectProps) {
   const errors = props.errors?.[props.name]
   const options = props.options ?? [{ value: "null", label: "no data provided" }]
   const displayLabel = (props.name ?? props.label).replace(/_/gi, " ")

   return (
      <div>
         {
            props.noLabel ? null :
               <label
                  htmlFor={props.name}
                  className={`flex mb-2 items-center justify-between text-sm`}
               >
                  <span className={`text-gray-500 ${props.acronym ? "uppercase" : "capitalize"}`}>
                     {displayLabel}
                  </span>
                  {
                     errors ?
                        <span className="inline-block text-red-600 text-xs text-right">
                           {errors.message}
                        </span>
                        : null
                  }
               </label>
         }
         <select
            className={cx(
               buttonHeight,
               props.width ?? "w-full", errors && "error",
               '!py-0'
            )}
            defaultValue={props.initialValue ?? ""}
            onChange={props.onChange}
            {...props.register?.(props.name, {
               required: props.required ? "Required" : false
            })}
         >
            <option value="">{`-- Select a ${displayLabel} --`}</option>
            {
               options.map?.((option) =>
                  <option
                     key={option.value}
                     value={option.value}
                     className="capitalize"
                  >
                     {option.label ?? option.value}
                  </option>
               )
            }
         </select>
      </div>
   )
}
