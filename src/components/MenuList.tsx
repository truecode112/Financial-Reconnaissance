import { cx } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import React from "react";
import { IconType } from "react-icons/lib";

export interface _MenuList {
   label: string,
   link?: string,
   icon?: IconType,
   onClick?(): void,
   highlightColor?: string
   separator?: boolean
   enabled?: boolean
   render?: (active: boolean) => React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

interface Props {
   children: React.ReactNode,
   menuList: _MenuList[],
   header?: React.ReactNode
}
export default function MenuList(props: Props) {
   return (
      <div className="relative inline-block text-left z-20">
         <Menu>
            {({ open }) => (
               <>
                  <span className="rounded-md shadow-sm">
                     <Menu.Button as="div" className="cursor-pointer">
                        {props.children}
                     </Menu.Button>
                  </span>

                  <Transition
                     show={open}
                     enter="transition ease-out duration-100"
                     enterFrom="transform opacity-0 scale-95"
                     enterTo="transform opacity-100 scale-100"
                     leave="transition ease-in duration-75"
                     leaveFrom="transform opacity-100 scale-100"
                     leaveTo="transform opacity-0 scale-95"
                  >
                     <Menu.Items
                        static
                        className={cx(
                           'w-[200px] p-1.5 absolute right-0 origin-top-right bg-white',
                           'border-gray-200 rounded-lg shadow',
                           'outline-none ring-1 ring-slate-200'
                        )}
                     >
                        {
                           props.menuList.map(menu => {
                              const { icon: Icon, highlightColor = 'bg-red-50 text-red-600', enabled = true } = menu

                              if (!enabled) return null

                              return (
                                 <Menu.Item key={menu.label}>
                                    {({ active }) =>
                                       menu.render?.(active) ??
                                       (
                                          <div
                                             onClick={menu.onClick}
                                             className={cx(
                                                'flex items-center w-full px-3 py-2 text-sm',
                                                "space-x-3 cursor-pointer rounded-lg",
                                                active && highlightColor,
                                                active ? 'text-red-600' : 'text-slate-600',
                                                menu.separator && 'border-t',
                                             )}
                                          >
                                             {Icon && <Icon className="text-md flex-none" />}
                                             <span>
                                                {menu.label}
                                             </span>
                                          </div>
                                       )}
                                 </Menu.Item>
                              )
                           })
                        }
                     </Menu.Items>
                  </Transition>
               </>
            )}
         </Menu>
      </div>
   );
}