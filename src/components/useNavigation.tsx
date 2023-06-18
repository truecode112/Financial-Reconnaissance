import { lazy } from "react"
import {
   FiBox as ATMIcon,
   FiServer as ATMsIcon,
   FiLayers as CashIcon,
   FiInbox,
   FiMapPin as LocationIcon,
   FiBarChart2 as OverviewIcon,
   FiPieChart as ReportsIcon,
   FiActivity as TrxIcon,
   FiUsers as UserIcon
} from "react-icons/fi"

import { slugify } from "@/lib/utils"
import PrivateRoute from "@/pages/PrivateRoute"
import Overview from "@/pages/overview/Overview.page"
const Exception = lazy(() => import("@/pages/transaction_management/Exception.page"))
const JournalFootageSearch = lazy(() => import("@/pages/transaction_management/JournalFootageSearch.page"))
const TransactionInvestigation = lazy(() => import("@/pages/transaction_management/TransactionInvestigation.page"))
const TransactionManagement = lazy(() => import("@/pages/reports/TransactionManagement.page"))
const AtmManagement = lazy(() => import("@/pages/reports/AtmManagement.page"))
const CashAudit = lazy(() => import("@/pages/cash_management/CashAudit.page"))
const CashEvacuated = lazy(() => import("@/pages/cash_management/CashEvacuated.page"))
const ConfigureAtm = lazy(() => import("@/pages/atm_management/ConfigureAtm.page"))
const IncidentManagement = lazy(() => import("@/pages/atm_management/IncidentManagement.page"))
const CreateModifyUser = lazy(() => import("@/pages/user_management/CreateModifyUser.page"))
const AuditTrail = lazy(() => import("@/pages/user_management/AuditTrail.page"))
const Archives = lazy(() => import("@/pages/archives/Archives.page"))
const ContentManager = lazy(() => import("@/pages/atm_management/ContentManager.page"))
const LocationAnalysis = lazy(() => import("@/pages/location_analysis/LocationAnalysis.page"))

export const tabs: _SidebarTab[] = [
   {
      name: 'ATM',
      icon: ATMsIcon,
      children: [
         {
            url: '/',
            name: 'Overview',
            icon: OverviewIcon,
            path: ['/'],
            component: Overview
         },
         {
            name: 'transaction management',
            icon: TrxIcon,
            children: [
               {
                  name: "journal & footage retrieval",
                  component: JournalFootageSearch
               },
               {
                  name: "transaction investigation",
                  component: TransactionInvestigation
               },
               {
                  name: "exceptions",
                  component: Exception
               },
            ]
         },
         {
            name: 'cash management',
            icon: CashIcon,
            children: [
               {
                  name: "cash audit",
                  component: CashAudit
               },
               {
                  name: "cash evacuated",
                  component: CashEvacuated
               },
            ]
         },
         {
            name: 'ATM management',
            icon: ATMIcon,
            children: [
               {
                  name: "configure ATM",
                  component: ConfigureAtm
               },
               {
                  name: "incident management",
                  component: IncidentManagement
               },
               {
                  name: "content manager",
                  component: ContentManager
               },
            ]
         },
         {
            name: 'user management',
            icon: UserIcon,
            children: [
               {
                  name: "create / modify user",
                  component: CreateModifyUser
               },
               {
                  name: "audit trail / login audit",
                  component: AuditTrail
               },
            ]
         },
         {
            name: 'reports',
            icon: ReportsIcon,
            children: [
               {
                  name: "transaction management",
                  component: TransactionManagement
               },
               {
                  name: "ATM management",
                  component: AtmManagement
               },
            ]
         },
         {
            name: 'archives',
            icon: FiInbox,
            component: Archives
         },
         {
            name: 'location analysis',
            icon: LocationIcon,
            component: LocationAnalysis
         },
      ]
   },
]

export default function useNavigation() {
   function getFlattenedRoutes(tabs: _SidebarTab[], routes: React.ReactNode[], _pathnames: string[]) {
      for (const tab of tabs) {
         const pathnames = [..._pathnames, tab.name]
         if (tab.component) {
            const path = pathnames.map(p => slugify(p)).join('/')
            tab.url ??= '/' + path
            routes.push(
               <PrivateRoute
                  exact
                  key={tab.name + path}
                  path={tab.path ?? [`/${path}`]}
                  component={tab.component}
               />
            )
         }
         if (tab.children) {
            getFlattenedRoutes(tab.children, routes, pathnames)
         }
      }

      return routes
   }

   return {
      Routes: getFlattenedRoutes(tabs, [], []),
      tabs
   }
}

