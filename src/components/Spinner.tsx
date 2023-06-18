import { BiLoaderAlt } from "react-icons/bi"

export default function Spinner({ color = "text-red-600", size = 'text-3xl' }) {
   return <BiLoaderAlt className={`${size} ${color} animate-spin`} />
}

export function SwingIndicator({ position = "-bottom-1", color = "bg-gray-600", height = "h-1" }) {
   return (
      <div className={`w-full overflow-hidden absolute left-0 ${position}`}>
         <div className={`${height} w-full animateSwing`}>
            <span className={`bar h-full block ${color}`}></span>
         </div>
      </div>
   )
}