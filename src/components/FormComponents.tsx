import { UseFormRegister } from "react-hook-form"
import Select from "./Select"
import React from "react"
import { buttonHeight } from "@/lib/config"
import { cx } from "@/lib/utils"

export const validationPatterns = {
   "numeric": {
      // value: /^[0-9]+$/,
      value: /^[0-9]+(\.[0-9]{1,2})?$/, //allow a decimal point and two numbers after
      message: "Please enter numbers only"
   },
   "email": {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: "Invalid Email Address"
   },
   "phone": {
      value: /^[-+]?[0-9]+$/,
      message: "Invalid phone number format"
   },
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   name: string
   pattern?: keyof typeof validationPatterns
   register?: UseFormRegister<any>
   errors?: _Object
   textarea?: boolean
   label?: string,
   showLabel?: boolean,
   capitalize?: boolean,
   acronym?: boolean
   validation?: {
      value: RegExp,
      message: string
   }
}
export function Input({ showLabel = true, ...props }: InputProps) {
   const errors = props.errors ?? {}
   let label = props.label ?? props.name.replace(/[\W_]+/g, " ")
   if (props.required) label += ' *'

   //Workaround overwriting register's onChange|onBlur events
   //register return {onChange, onBlur, name, ref}
   const fieldRegister = props.register?.(props.name, {
      //@ts-ignore
      pattern: props.pattern ? validationPatterns[props.pattern] : {} as ValidationRule<RegExp>,
      required: !!props.required ? "Required" : false,
      minLength: props.minLength ? {
         value: props.minLength,
         message: `Must be at least ${props.minLength} characters`
      } : undefined,
      maxLength: props.maxLength ? {
         value: props.maxLength,
         message: `Must be less than ${props.maxLength} characters`
      } : undefined,
   }) ?? {} as _Object

   return (
      <div className="space-y-1" key={label + props.name}>
         {
            showLabel &&
            <label htmlFor={props.name} className={`flex items-center justify-between text-sm`}>
               <span className={`text-gray-500 ${props.acronym ? "uppercase" : "capitalize"}`}>
                  {label}
               </span>
               {
                  errors?.[props.name] &&
                  <span className="inline-block text-red-600 text-xs text-right">
                     {errors[props.name].message}
                  </span>
               }
            </label>
         }
         <input
            aria-label={props.name}
            type={props.type ?? "text"}
            defaultValue={props.defaultValue}
            placeholder={props.placeholder}
            className={cx(errors?.[props.name] && "error", buttonHeight)}
            {...fieldRegister}
         />
      </div>
   )
}

interface FormDataProps extends Omit<InputProps, "name"> {
   data: _SearchFormInput[],
   defaultValues?: _Object
}
export function FormData(props: Required<Pick<FormDataProps, 'data' | 'register' | 'errors' | 'defaultValues'>>) {
   return (
      <>
         {
            props.data.map((element, i) => {
               switch (element.type) {
                  case 'radio': {
                     return (
                        <div
                           key={i}
                           className={`space-y-1 border rounded-lg p-3 bg-gray-50`}
                        >
                           <label
                              htmlFor={element.name}
                              className="text-gray-500 text-sm capitalize"
                           >
                              {element.name} {element.required ? '*' : ''}
                           </label>
                           <div className="flex flex-wrap -m-2">
                              {element.options?.map(checkbox => {
                                 const label = (checkbox.label ?? checkbox.name).replace(/_/gi, " ")
                                 const defaultChecked = props.defaultValues.current?.[checkbox.name] === String(checkbox.value) || checkbox.checked

                                 return (
                                    <div
                                       key={label}
                                       className="space-x-2 m-2"
                                    >
                                       <input
                                          type="radio"
                                          aria-label={label}
                                          value={checkbox.value ?? label}
                                          defaultChecked={defaultChecked}
                                          {...props.register(element.name, {
                                             required: element.required ? "Please select one of these fields" : false,
                                          })}
                                       />
                                       <span className="text-gray-600 text-xs capitalize">
                                          {label}
                                       </span>
                                    </div>
                                 )
                              })}
                           </div>
                           {
                              props.errors?.[element.name] &&
                              <span className="block text-red-600 text-sm">
                                 {props.errors[element.name].message}
                              </span>
                           }
                        </div>
                     )
                  }

                  case 'select': {
                     return (
                        <Select
                           key={i}
                           name={element.name}
                           label={element.label ? (element.label + element.required ? ' *' : '') : ''}
                           required={element.required}
                           options={element.initialOptions}
                           register={props.register}
                           errors={props.errors}
                        />
                     )
                  }

                  case 'group': {
                     if (element.options) return (
                        <div key={i} className="space-y-1">
                           <p className={`text-gray-500 text-sm ${element.acronym ? "uppercase" : "capitalize"}`}>
                              {element.name} {element.required ? '*' : ''}
                           </p>
                           <div className="grid grid-cols-2 gap-4">
                              {element.options.map(inp => <Input
                                 key={inp.name}
                                 name={inp.name}
                                 label={inp.name}
                                 pattern="numeric"
                                 placeholder={inp.placeholder}
                                 register={props.register}
                                 errors={props.errors}
                                 showLabel={false}
                                 defaultValue={props.defaultValues.current?.[inp.name]}
                                 required={element.required} />
                              )}
                           </div>
                        </div>
                     )
                     break
                  }

                  default: {
                     return (
                        <Input
                           key={i}
                           type={element.type}
                           name={element.name}
                           label={element.label}
                           register={props.register}
                           errors={props.errors}
                           acronym={element.acronym}
                           defaultValue={props.defaultValues.current?.[element.name]}
                           required={element.required}
                        />
                     )
                  }
               }
            })
         }
      </>
   )
}