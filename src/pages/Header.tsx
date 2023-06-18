import { BsShieldLock } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { useIsFetching } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import Button from "../components/Button";
import MenuIcon from "../components/MenuIcon";
import { SwingIndicator } from "../components/Spinner";
import { useAuth } from "../contexts/Auth.context";
import { cx } from "../lib/utils";

const headerHeight = 'h-14'

export default function Header() {
   const history = useHistory()
   const { signOut, authenticatedUser: user } = useAuth()
   const isFetching = useIsFetching()

   return (
      <header className={`bg-red-700 px-8 relative flex items-center justify-between shadow z-10 ${headerHeight}`}>
         <div style={{ width: 330 }} className="flex min-w-min items-center space-x-4 relative z-10">
            <MenuIcon color="white" />
            <BrandLogo redirect />
         </div>

         <div className="flex items-center justify-end space-x-6 relative z-10">
            <div
               onClick={() => history.push({ pathname: 'license' })}
               className={cx(
                  "h-11 text-white px-3 text-xl grid place-content-center rounded-md",
                  "border-dashed border border-transparent cursor-pointer",
                  "hover:border-red-300 transition-all"
               )}
            >
               <BsShieldLock className="" />
            </div>
            <p className="flex-shrink-0 text-sm text-red-200">Hello, {user?.username}</p>
            <HiOutlineMail className="text-red-200 text-2xl flex-shrink-0" />
            <Button name="logout" variant="darker" onClick={signOut}>Log out</Button>
         </div>

         <div className="h-full w-full grid place-items-center absolute top-0 left-0">
            {
               isFetching ?
                  <SwingIndicator
                     position="top-0"
                     height={headerHeight}
                     color="bg-gradient-to-r from-red-700 to-red-400 opacity-70"
                  />
                  : null
            }
            {
               // isMutating ?
               //     <motion.div
               //         key="spinner"
               //         aria-label="spinner"
               //         initial={{ y: -40, opacity: 0 }}
               //         exit={{ y: 0, opacity: 0 }}
               //         animate={{ y: 0, opacity: 1 }}
               //         className="bg-transparent"
               //     >
               //         <Spinner color="text-red-200" fast />
               //     </motion.div>
               //     : null
            }
         </div>
      </header>
   );
}