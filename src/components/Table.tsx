import { useEffect, useRef, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { queryLimit } from "../lib/fetch";
import { cx, tableEntryMapper } from '../lib/utils';
import Button from "./Button";

export interface TableProps {
   data: _Object[],
   headers: _TableHeader[],
   claim?: boolean,
   isLoading?: boolean,
   setOffset?: React.Dispatch<React.SetStateAction<number>>
   updateSelection?: (entry?: _Object | null, action?: 'add' | 'remove') => void,
   removeFromSelection?: (id: string) => void,
   fetchMore?: boolean,
   loadMore?: boolean,
   groupRecordsById?: string
}

export default function Table({ data = [], fetchMore = true, ...props }: TableProps) {
   const [checkAll, setcheckAll] = useState(false)
   const checkAllRef = useRef<HTMLInputElement>(null)

   useEffect(() => {
      //Clear the selection when checkAll is deselected, or when data is fetching.
      if ((props.claim && !checkAll) || props.isLoading) {
         props.updateSelection?.()
      }
      //Clear selection state if all is checked and data is fetching.
      if (checkAll && props.isLoading) {
         setcheckAll(false)
      }
   }, [props.claim, checkAll, props.isLoading])

   return (
      <div className={`h-full min-h-[600px] bg-white border rounded-lg overflow-y-auto scrollbar shadow-lg`}>
         <table className="bg-white border-collapse min-w-full">
            <thead>
               <tr>
                  {/* selected indicator and spacer ---> ghost */}
                  <th className="bg-gray-50 h-full sticky top-0 left-0 z-20">
                     <div className="w-2 h-full opacity-0"></div>
                  </th>

                  {
                     props.headers.map((elem, i) => {
                        let { key, label, orderBy, suffix = '', sticky = false } = elem
                        label = (label ?? key).replace(/_/gi, " ") + ' ' + suffix

                        return (
                           <th
                              key={i}
                              scope="col"
                              className={cx(
                                 'h-11 px-6 py-3 text-left text-xs font-bold text-gray-400 bg-gray-50',
                                 'sticky top-0  uppercase tracking-wide whitespace-nowrap',
                                 sticky ? "left-0 z-30" : "z-20"
                              )}
                           >
                              <div className={`flex items-center space-x-2 ${orderBy && "cursor-pointer"}`}>
                                 <span>{label}</span>
                                 {
                                    orderBy && <span className="text-md text-gray-400"><FiArrowUp /></span>
                                 }
                              </div>
                           </th>
                        )
                     })
                  }
                  {
                     props.claim &&
                     <th scope="col" className="bg-gray-50 px-4 text-gray-500 sticky top-0 z-20">
                        <input
                           ref={checkAllRef}
                           aria-label="select-all"
                           type="checkbox"
                           onChange={(e) => setcheckAll(e.target.checked)}
                        />
                     </th>
                  }
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
               {
                  data?.length ? data.map((entry, index) =>
                     <TableRow
                        //entry.id is best but there are instances of multiple entries with the same id
                        //Reset isolated state when fetching new data for tables with selection enabled (deselection)
                        key={[index, props.claim ? props.isLoading : 0].toString()}
                        data={entry}
                        headers={props.headers}
                        claim={props.claim}
                        checked={checkAll}
                        updateSelection={props.updateSelection}
                     />
                  ) : null
               }
            </tbody>
         </table>
         <LoadMore
            data={data}
            loadMore={fetchMore}
            setOffset={props.setOffset!}
            isLoading={props.isLoading!}
         />
      </div>
   )
}

function TableRow(props: Pick<TableProps, 'headers' | 'claim' | 'updateSelection'> & {
   data: _Object, checked: boolean
}) {
   const [isChecked, setIsChecked] = useState(false)

   useEffect(() => {
      if (props.claim) setIsChecked(props.checked)
   }, [props.claim, props.checked])

   useEffect(() => {
      if (props.claim) {
         const action = isChecked ? "add" : "remove"
         //??unclear
         props.updateSelection?.(props.data, action)
      }
   }, [props.claim, isChecked])

   return (
      <tr>

         {/* selected indicator and spacer */}
         <td className={`${isChecked && "bg-red-500"}`}></td>

         {
            props.headers.map((elem, index) => {
               const { key, label, elementType, modifier, capitalize = true, sticky = false, children } = elem
               const val = tableEntryMapper(key ?? label, props.data)
               const value = modifier?.(val) ?? val

               return (
                  <td
                     key={label + index}
                     aria-label={label}
                     className={cx(
                        'bg-white p-6 py-4 text-sm',
                        sticky && "sticky left-0 z-10",
                        value?.length < 15 && "whitespace-nowrap"
                     )}>
                     {
                        children ??
                        <p className={cx(
                           capitalize && "capitalize",
                           'bg-white text-gray-600',
                           sticky && "whitespace-nowrap"
                        )}>
                           {
                              elementType?.name === "imageSrc" && elementType.openInline ?
                                 <span
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => elementType.open?.(value)}
                                 >{value}</span>
                                 : value
                           }
                        </p>
                     }
                  </td>
               )
            })
         }
         {
            props.claim &&
            <td className="px-4">
               <input
                  type="checkbox"
                  aria-label="selection-checkbox"
                  value="claim ownership"
                  checked={isChecked}
                  onChange={() => null}
                  onClick={() => setIsChecked(st => !st)}
               />
            </td>
         }
      </tr>
   )
}

export function LoadMore(props: Pick<TableProps, 'data' | 'loadMore' | 'isLoading' | 'setOffset'>) {
   return (
      <div className="py-2 px-4 h-20 grid grid-cols-5 items-center border-t sticky left-0">
         {
            props.data?.length ?
               <>
                  <span className="col-span-2 px-2 text-xs uppercase tracking-wider text-gray-500">
                     <b>{props.data.length}</b> records
                  </span>
                  {
                     props.loadMore ?
                        <span className="p-2 ">
                           <Button
                              name="load-more"
                              disabled={props.isLoading}
                              onClick={() => props.setOffset?.(ofst => ofst ? ofst + queryLimit : ofst)}
                           >
                              {props.isLoading ? "Loading..." : "Load More"}
                           </Button>
                        </span>
                        : null
                  }
               </>
               : null
         }
      </div>
   )
}