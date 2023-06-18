import { useHistory } from "react-router-dom"
import { cx } from "../lib/utils"

interface BrandLogoProps {
   dark?: boolean,
   center?: boolean,
   large?: boolean,
   redirect?: boolean
}
export default function BrandLogo({ dark, center, large, redirect }: BrandLogoProps) {
   const history = useHistory()

   return (
      <div
         className={cx(
            'leading-4 cursor-pointer select-none text-xl uppercase',
            center && "text-center",
            large && "space-y-2"
         )}
         onClick={() => redirect && history.push("/")}
      >
         <p
            className={cx(
               'block font-bold leading-3',
               large ? "text-xl" : "text-sm",
               dark ? "text-red-600" : "text-white"
            )}
         >Camguard</p>
         <p
            className={cx(
               large ? "text-3xl" : "text-sm",
               dark ? "text-gray-500" : "text-red-300"
            )}
         >
            Financial
            <span className={cx('font-bold', dark ? "text-gray-700" : "text-red-100")}>
               RECONNAISSANCE
            </span>
         </p>
      </div>
   )
}