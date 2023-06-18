import { ReactNode, createContext, useContext, useState } from 'react';
import sampleArchives from "@/devServer/sampleData/sampleArchives.js";
import { queryKeys } from '@/lib/config';
import { useFetch } from '@/lib/fetch';
import { toSelectOptions } from '@/lib/utils'

interface ContextInterface {
   sidebarIsOpen: boolean
   setsidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   toggleSidebar(): void
   archiveContext?: typeof sampleArchives[number],
   setArchiveContext: React.Dispatch<React.SetStateAction<ContextInterface['archiveContext'] | undefined>>
   showCountdown?: boolean
   setshowCountdown: React.Dispatch<React.SetStateAction<boolean>>
   brandsList: _SelectInputOption[]
   statesList: _SelectInputOption[]
   rolesList: _SelectInputOption[]
}

export const StoreContext = createContext({} as ContextInterface)
export const useStore = () => useContext(StoreContext)

export function StoreProvider(props: { children: ReactNode }) {
   const [sidebarIsOpen, setsidebarIsOpen] = useState(true);
   const [showCountdown, setshowCountdown] = useState(true);
   const [archiveContext, setArchiveContext] = useState<ContextInterface['archiveContext']>()

   useFetch({
      url: 'archives/getarchivestatus',
      queryKey: queryKeys.archiveStatus,
      errorMessage: "Error fetching current archive",
      onSuccess: (data: ContextInterface['archiveContext']) => data?.name && setArchiveContext(data)
   })

   // Add States list...
   const { data: states } = useFetch<string[]>({
      queryKey: ['statesList'],
      url: 'passport/states',
      errorMessage: "Error fetching states list"
   })
   // Add Roles list...
   const { data: roles } = useFetch({
      queryKey: ['userRoles'],
      url: 'passport/roles',
      errorMessage: "Error fetching user roles"
   })
   // Add Brands list...
   const { data: brands } = useFetch<string[]>({
      queryKey: ['atms-brands'],
      url: 'atms/brands',
      errorMessage: "Error fetching ATM brands"
   })

   const statesList = toSelectOptions(states)
   const rolesList = toSelectOptions(roles, (obj: _Object) => obj.name)
   const brandsList = toSelectOptions(brands)

   const toggleSidebar = () => setsidebarIsOpen(st => !st)

   return (
      <StoreContext.Provider value={{
         archiveContext, setArchiveContext,
         sidebarIsOpen, setsidebarIsOpen, toggleSidebar, brandsList,
         showCountdown, setshowCountdown, statesList, rolesList,
      }}>
         {props.children}
      </StoreContext.Provider>
   )
}