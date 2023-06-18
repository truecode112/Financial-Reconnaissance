import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiInbox } from "react-icons/fi";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import { useStore } from "../../contexts/Store.context";
import { useFetch, useMutate } from "../../lib/fetch";
import { cx } from "../../lib/utils";
import { queryKeys } from "../../lib/config";
import sampleArchives from "../../devServer/sampleData/sampleArchives";

interface ArchiveProps {
   archive: typeof sampleArchives[number]
   handlePost?: (archive: ArchiveProps['archive']) => void
   isLoading?: boolean
   active?: boolean
}

export default function ArchivesList() {
   const { archiveContext, setArchiveContext } = useStore()

   const { data: archives = [] } = useFetch<ArchiveProps['archive'][]>({
      queryKey: [queryKeys.archive, 'list'],
      url: `archives/list`
   })

   const { isLoading, mutate: bootArchive } = useMutate({
      url: "archives/bootarchive",
      refetchKey: [queryKeys.archive],
      successMessage: "Archive booted succesfully",
      onSuccessCallback: (data) => setArchiveContext(data)
   })

   const handlePost: ArchiveProps['handlePost'] = (payload) => {
      if (!isLoading) bootArchive(payload as any)
   }

   return (
      <div className="pb-4 flex flex-col h-full overflow-hidden text-gray-700">
         {/* @ts-ignore */}
         <PageHeader title='Archives' />
         {
            archiveContext &&
            <div className="py-8 border-b space-y-3 pb-8 w-full max-w-5xl mx-auto">
               <h3 className="text leading-tight uppercase text-gray-600">current archive</h3>
               <Archive
                  archive={archiveContext}
                  active
               />
            </div>
         }
         <div className=" h-full p-6 overflow-y-auto scrollbar">
            <div className="w-full mx-auto max-w-5xl space-y-2">
               {
                  archives?.map?.((arc, i) =>
                     <Archive
                        archive={arc}
                        key={arc.archiveID + i}
                        handlePost={handlePost}
                        isLoading={isLoading}
                     />
                  ) ?? <p>There are no archives to display</p>
               }
            </div>
         </div>
      </div>
   )
}

function Archive({ archive, handlePost, active, isLoading }: ArchiveProps) {
   const { name } = archive ?? {}

   return (
      <motion.div
         whileHover={{ y: -2 }}
         whileTap={{ scale: 0.99 }}
         onClick={() => !active && handlePost?.(archive)}
         className={cx(
            "flex p-4 py-3 rounded-lg space-x-6 group",
            active ? "bg-red-600 text-white shadow-lg" : "bg-white border",
            isLoading && "pointer-events-none opacity-50",
            !active && "cursor-pointer"
         )}
      >
         <div className={cx(
            'min-h-full flex items-center justify-center text-4xl group-hover:text-white',
            active ? "text-white" : "text-gray-300"
         )}>
            {active && <FiInbox />}
         </div>
         <div className="w-full flex space-x-4 items-center justify-between pr-6">
            <div className={`text-lg uppercase text-left`}>
               <p className={`text-xs uppercase tracking-wider opacity-70`}>name</p>
               <p>{name}</p>
            </div>
         </div>
         {
            isLoading &&
            <p className="w-full max-w-xs text-right text-xs">
               Please wait...
            </p>
         }
      </motion.div>
   )
}

export function LoggOffArchive() {
   const [logOff, setLogOff] = useState(false)
   const { archiveContext, setArchiveContext } = useStore()
   const { isSuccess, data: archive, remove } = useFetch({
      queryKey: ['log-off-archive'],
      enabled: logOff,
      url: `archives/logoffarchive`,
   })

   useEffect(() => {
      if (isSuccess && archive) {
         setArchiveContext(undefined)
         remove()
      }
      //eslint-disable-next-line
   }, [isSuccess, archive])

   return (
      <motion.div
         initial={{
            scale: 0.7,
            y: -20,
            opacity: 0
         }}
         animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
               type: 'tween'
            }
         }}
         className={`${archiveContext ? "py-8" : "h-12"} p-4 items-center w-full border-b text-gray-600 space-y-2`}
      >
         <p className="truncate text-center">
            <span className="uppercase text-gray-600 tracking-wider">{archiveContext?.name}</span>
         </p>
         <Button
            fullWidth
            onClick={() => setLogOff(true)}
         >
            Log off archive
         </Button>
      </motion.div>
   )
}