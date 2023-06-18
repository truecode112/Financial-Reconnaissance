declare module "react-csv"
declare module "react-router-dom"

type SetState<T> = ReturnType<typeof React.useState<T>>[1]
type ClassName = React.HTMLAttributes<any>['className']

type FilterKeys<Obj, Keys extends keyof Obj> = {
   [K in keyof Obj]: K extends Keys ? K : never
}[keyof Obj]

type Color = `#${string}`

interface _TableHeader {
   label: string,
   key?: string,
   sticky?: boolean,
   orderBy?: boolean,
   modifier?: (arg) => string | number | null,
   elementType?: {
      name?: "static" | "select" | "input" | "imageSrc"
      empty?: boolean,
      inputType?: string,
      initialOptions?: { label: string, value: string | number }[],
      open?: (arg) => void,
      close?: () => void,
      openInline?: boolean
   },
   suffix?: string,
   capitalize?: boolean,
   placeholder?: string,
   children?: React.ReactNode
}

interface _SearchFormInput {
   name: string,
   label?: string,
   type?: "radio" | "select" | "group" | "date" | "number",
   required?: boolean,
   options?: {
      name: string,
      placeholder?: string,
      label?: string,
      value?: string | number,
      checked?: boolean
   }[],
   initialOptions?: _SelectInputOption[]
   acronym?: boolean,
   orderBy?: boolean,
   modifier?: (arg) => string | number | null,
}

interface _RequestData {
   data?: _Object[],
   refetch?(): void,
   isLoading?: boolean
}

interface _SidebarTab {
   name: string,
   icon?: JSXElementConstructor
   path?: string[]
   url?: string
   component?: JSXElementConstructor
   children?: _SidebarTab[]
   dummy?: boolean
}

interface _BoxComponent {
   title: string,
   count?: number
   icon?: JSXElementConstructor,
   component?: JSXElementConstructor,
   url?: string,
   postUrl?: [string, string]
   countUrl?: string,
   groupRecordsById?: string
}

interface _Object {
   [key: string]: any
}

interface _SelectInputOption { label: string, value: any }

interface _Tab { name: string, component: React.JSXElementConstructor }