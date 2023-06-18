import CenterBoxContainer from "./CenterBoxContainer"
import BrandLogo from "./BrandLogo"
import { motion } from "framer-motion"
import { SwingIndicator } from "./Spinner"

export default function BrandLogoLoader() {
   return (
      <CenterBoxContainer height={'100vh'}>
         <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="flex flex-col items-center space-y-8 h-60"
         >
            <BrandLogo dark center large />
            <div className="w-full relative h-1.5 bg-red-100 rounded">
               <SwingIndicator
                  color="bg-red-600"
                  position="top-0"
                  height="h-1.5 rounded"
               />
            </div>
         </motion.div>
      </CenterBoxContainer>)
}
