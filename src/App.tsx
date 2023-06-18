import { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/Auth.context';
import { StoreProvider } from './contexts/Store.context';
import { ToastProvider } from './contexts/Notification.context';
import { Switch, BrowserRouter as Router, Route } from "react-router-dom"
import PrivateRoute from "./pages/PrivateRoute"
import { QueryClientProvider } from "@tanstack/react-query";
import { slugify } from "./lib/utils"
import { queryClientConfig } from "./lib/config"
import ForceReload from "./components/ForceReload"

import Login from './pages/Login';
import Header from "./pages/Header"
import Sidebar from './pages/Sidebar';

/** 
 * devServer() should only be run in development mode as it will block all network requests
 * to use the local server instead.
 * The deServer also imports dummy data which will be bundled into the source if imported.
*/
import devServer from "./devServer/server" //Comment to reduce build size before build. Uncomment in dev mode
import useNavigation from './components/useNavigation';
if (import.meta.env.VITE_NODE_ENV === "development") {
  devServer()
} else {
  console.log('non development mode');
}
/** 
 * Uncomment in dev mode
*/

const License = lazy(() => import("./pages/License.page"))

export default function App() {
   const { Routes } = useNavigation()

   return (
      <ErrorBoundary>
         <Suspense fallback={<div></div>}>
            <Router basename="app">
               <QueryClientProvider client={queryClientConfig}>
                  <AuthProvider>
                     <Switch>
                        <Route exact path={[`/login`]}><Login /></Route>
                        <ToastProvider>
                           <StoreProvider>
                              <main className="app h-screen flex flex-col antialiased text-sm" style={{ minWidth: 960 }}>
                                 <Header />
                                 <div className="bg-gray-50 flex flex-1 overflow-hidden">
                                    <Sidebar />
                                    <div style={{ minWidth: 1080 }} className="flex-1 scrollbar overflow-y-auto">
                                       {Routes}
                                       <PrivateRoute
                                          exact
                                          path={[`/${slugify("License")}`]}
                                          component={License}
                                       />
                                    </div>
                                 </div>
                              </main>
                           </StoreProvider>
                           <ForceReload />
                        </ToastProvider>
                     </Switch>
                  </AuthProvider>
               </QueryClientProvider>
            </Router>
         </Suspense>
      </ErrorBoundary>
   )
}