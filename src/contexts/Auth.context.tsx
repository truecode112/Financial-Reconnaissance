import axios from 'axios'
import decode from "jwt-decode"
import { useState, createContext, useContext, useEffect } from 'react'
import { useHistory, useLocation } from "react-router-dom"
import { baseUrl } from '../lib/fetch'
import BrandLogoLoader from '../components/BrandLogoLoader'

interface ContextInterface {
   authenticatedUser: { username: string, token: string },
   setAuthenticatedUser: React.Dispatch<any>,
   signOut: (message: string) => void,
   isAuthenticating: boolean,
   saveCreds: (cred: string | _Object) => void
}

export const AuthContext = createContext({} as ContextInterface)
export const useAuth = () => useContext(AuthContext)
const crdKey = "__@module__@crds__"

export function AuthProvider(props: { children: React.ReactNode, location?: string }) {
   const history = useHistory()
   const location = useLocation()
   const [isAuthenticating, setIsAuthenticating] = useState(true) // True by default
   const [authenticatedUser, setAuthenticatedUser] = useState(() => {
      try {
         const creds = JSON.parse(localStorage.getItem(crdKey) as string)
         if (creds && decode(creds.token)) return creds
      } catch { return }
   })

   function signOut(message: string) {
      localStorage.clear()
      setAuthenticatedUser(undefined)
      history.push({
         pathname: "/login",
         state: { message }
      })
   }

   function saveCreds(credentials: string | _Object) {
      return localStorage.setItem(crdKey, JSON.stringify(credentials))
   }

   useEffect(() => {
      if (authenticatedUser?.token && location.pathname !== "/login") {
         axios.post(baseUrl + "Passport/validate", null, {
            headers: {
               "Authorization": `Bearer ${authenticatedUser.token}`
            }
         }).then(({ data }) => {
            // Stay on current page.
            if (data.token) {
               saveCreds(data)
               setAuthenticatedUser(data)
            }
            setIsAuthenticating(false)

         }).catch(() => {
            setIsAuthenticating(false)
            history.push({
               pathname: "/login",
               state: { from: props.location, message: "Unauthorized! Please sign in" }
            })
         })

      } else {
         setIsAuthenticating(false)
      }
      // eslint-disable-next-line
   }, [])

   return (
      <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser, signOut, isAuthenticating, saveCreds }}>
         {
            isAuthenticating ? <BrandLogoLoader /> : props.children
         }
      </AuthContext.Provider>
   )
}