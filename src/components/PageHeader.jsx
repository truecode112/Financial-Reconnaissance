import { FiChevronRight } from "react-icons/fi";

export default function PageHeader({ title, children }) {
   return (
      <section className="bg-white flex items-center px-6 h-20 border-b flex-shrink-0 justify-between">
         <div className="space-x-2 flex flex-1 items-center max-w-xs">
            <h2 className="text-xl text-gray-600 capitalize truncate">{title}</h2>
         </div>
         <div className="flex justify-end">{children}</div>
      </section>
   )
}
