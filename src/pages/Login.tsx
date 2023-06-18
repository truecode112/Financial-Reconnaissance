import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useHistory, useLocation } from "react-router-dom";
import decode from "jwt-decode"
import BrandLogo from "../components/BrandLogo";
import Button from "../components/Button";
import { Input } from "../components/FormComponents";
import { useAuth } from "../contexts/Auth.context";
import { baseUrl } from "../lib/fetch";
import { SwingIndicator } from "../components/Spinner";

interface FormState {
   username: string
   password: string
}

export default function Login() {
   let history = useHistory(), location = useLocation()
   const { setAuthenticatedUser, saveCreds } = useAuth()
   const { handleSubmit, register, formState: { errors } } = useForm<FormState>()

   const { isLoading, error, mutate, reset } = useMutation(data =>
      axios.post(baseUrl + "Passport/login/", data),
      {
         onSuccess: ({ data }) => {
            if (data?.token) {
               decode(data.token) // Important! Throws if invalid
               saveCreds(data)
               setAuthenticatedUser(data)
               reset()
               history.push({ pathname: "/", state: {} })
            } else {
               console.error("Response Error: Token field is missing from response")
            }
         },
         onError: () => {
            history.replace() // Clear location state error messages
         }
      }
   )

   const onSubmit = async (values: FormState) => {
      const { username, password } = values

      if (!isLoading) {
         const payload = { username, password, rememberMe: true }
         // mockLogin?.(payload)
         mutate(payload as any)
      }
   }

   return (
      <div className="h-screen flex flex-col items-center py-12 px-4">
         <div className="h-1/6 grid place-items-center">
            <BrandLogo center dark />
         </div>
         <div className="flex-1 w-full max-w-md space-y-2 p-8">
            <h1 className="text-center text-3xl sm:text-3xl font-medium text-gray-600">Sign in</h1>
            <div className="h-1 pt-4">
               {
                  isLoading &&
                  <div className="relative bg-gray-50 h-1">
                     <SwingIndicator color="bg-gray-400" position="top-0" />
                  </div>
               }
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="py-6 space-y-6 rounded-lg" autoComplete="off">
               {
                  error || location.state?.message ?
                     <div className="px-4 py-3 border bg-red-50 text-red-700 rounded-lg truncate">
                        {
                           error ?
                              (
                                 (error as _Object).response?.status === 401 ?
                                    "Invalid username or password" :
                                    (error as _Object).response?.status === 500 ?
                                       "User profile not available" :
                                       (error as _Object).message
                              ) :
                              location.state?.message ?
                                 location.state.message : null
                        }
                     </div> : null
               }
               <Input
                  name="username"
                  placeholder="Enter your username"
                  register={register}
                  errors={errors}
                  required
               />
               <Input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  register={register}
                  errors={errors}
                  required
               />
               <Button
                  fullWidth
                  type="submit"
                  name="sign in"
                  disabled={isLoading}
               >{isLoading ? "Signing you in..." : "Sign In"}</Button>
            </form>
         </div>
      </div>
   )
}