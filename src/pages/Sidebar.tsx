import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import { useLocation, useHistory } from "react-router-dom"
import { useStore } from "../contexts/Store.context"
import { cx, slugify } from "../lib/utils"
import { LoggOffArchive } from "./archives/Archives.page"
import useNavigation from "@/components/useNavigation"
import { useScreenSize } from "@/hooks"

const container = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1
      }
   }
}
const child = {
   hidden: { opacity: 0, y: -30 },
   show: { opacity: 1, y: 0 }
}

export default function Sidebar({ tabs = useNavigation().tabs }) {
   const { sidebarIsOpen, setsidebarIsOpen, archiveContext } = useStore()
   const { pathname } = useLocation()
   const year = new Date().getFullYear()
   const [selected, setSelected] = useState(0)

   const screenSize = useScreenSize()
   const isMobile = screenSize.match(/xs|sm|md/i)

   useEffect(() => {
      tabs.forEach((tab, index) => {
         const { children, name } = tab
         const matched = children?.some(ch => ch.url === pathname) || slugify(name) === pathname
         if (matched) setSelected(index)
      })
      // eslint-disable-next-line
   }, [pathname, tabs]);

   useEffect(() => {
      if (!screenSize.match(/lg/i) && sidebarIsOpen) {
         setsidebarIsOpen(false)
      }
   }, [screenSize])

   return (
      <div style={{ width: sidebarIsOpen ? 280 : 60 }}
         className={cx(
            "transition-all flex flex-col flex-shrink-0 border-r border-gray-300",
            "items-center bg-white overflow-x-hidden"
         )}
      >
         {
            sidebarIsOpen && archiveContext ? <LoggOffArchive /> :
               <div className={`h-12 px-4 flex items-center w-full border-b`}></div>
         }

         <div className="w-full flex-1 overflow-y-auto scrollbar bg-white relative">
            {
               tabs.map((tab, i) =>
                  <SidebarTab
                     index={i}
                     tab={tab}
                     level={0}
                     key={tab.name + i}
                     isSelected={selected === i} // First item is selected by default on mount
                     setSelected={setSelected}
                  />
               )
            }
         </div>

         {
            sidebarIsOpen ?
               <motion.p
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "tween" }}
                  className="text-gray-400 text-xs p-4 w-full text-left truncate border-t"
               >{year} &copy; Tekplugin. Version 1.2</motion.p>
               : null
         }
      </div>
   )
}

interface SidebarTabProps {
   tab: _SidebarTab,
   index: number,
   isSelected: boolean,
   setSelected: Function,
   // pathname: string
   level: number
}
function SidebarTab({ isSelected = false, ...props }: SidebarTabProps) {
   const { sidebarIsOpen, setsidebarIsOpen } = useStore()
   const [childIndex, setChildIndex] = useState(0)
   const history = useHistory()
   const location = useLocation()

   const { name, icon: Icon, children, dummy, url } = props.tab
   const hasChildren = Boolean(children && children?.length > 0)
   const matched = location.pathname === url

   function handleClick(e: React.SyntheticEvent) {
      e.stopPropagation()
      if (!isSelected && !dummy) {
         props.setSelected(props.index)
      } else {
         hasChildren && props.setSelected(null)
      }

      if (!sidebarIsOpen) setsidebarIsOpen(true)
      if (url && !dummy) history.push({ pathname: url })
   }

   useEffect(() => {
      //Auto expand current tab that contains active page on page load or refresh
      if (hasChildren) {
         if (children?.some(ch => location.pathname === ch.url)) {
            props.setSelected(props.index)
         }
      }
   }, [matched, children, url]);

   const paddingLeft = (1 + props.level) * 6 + 16

   return (
      <div className="w-full">
         <div
            style={{ paddingLeft }}
            onClick={handleClick}
            className={cx(
               "h-12 flex items-center px-4 space-x-2 cursor-pointer",
               "outline-none capitalize relative border-opacity-25",
               !sidebarIsOpen && "justify-center",
               isSelected && hasChildren ?
                  `font-bold ${sidebarIsOpen ?
                     "text-red-600 bg-red-100" : "text-white bg-red-600"}`
                  : "text-gray-500",
               props.level > 0 && matched && "bg-gray-100"
            )}
         >
            {
               <span
                  className="transition-colors w-4 h-8 flex items-center justify-center"
                  aria-label="sidebar-icon"
               >
                  {
                     Icon ?
                        <Icon className="text-lg" /> :
                        <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                  }
               </span>
            }
            {
               //only render these if sidebar is expanded
               sidebarIsOpen &&
               <>
                  <span className={`flex-1 truncate select-none ${matched && "text-red-600"}`}>
                     {name}
                  </span>
                  {
                     hasChildren &&
                     <span aria-label={name}>
                        {
                           <FiChevronDown
                              className={cx(
                                 'text-lg transform transition-transform',
                                 isSelected && "origin-center rotate-180"
                              )}
                           />
                        }
                     </span>
                  }
               </>
            }
            {
               //selected page vertical indicator
               matched &&
               <span className="w-4 h-full block absolute right-0 top-0 border-r-8 border-red-600"></span>
            }
         </div>
         {
            //Recursively render children if any, and if sidebar is expanded
            sidebarIsOpen && isSelected ?
               <motion.ul
                  variants={container}
                  className=""
                  initial="hidden"
                  animate="show"
               >
                  {
                     hasChildren ? children?.map((el, i) => {
                        return (
                           <motion.li
                              aria-label={el.name}
                              variants={child}
                              key={el.name + i}
                              onClick={handleClick}
                              className={`cursor-pointer outline-none capitalize text-sm flex items-center`}
                           >
                              <SidebarTab
                                 tab={el}
                                 index={i}
                                 isSelected={childIndex === i}
                                 setSelected={setChildIndex}
                                 level={props.level + 1}
                              />
                           </motion.li>
                        )
                     }) : null
                  }
               </motion.ul>
               : null
         }
      </div>
   )
}