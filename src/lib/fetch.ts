import axios from "axios"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../contexts/Auth.context"
import { useToast } from "../contexts/Notification.context"
import { sanitizeUnsafeText } from "./utils"

export const GLOBAL_API_URLS = {
   live: "https://camguarddashboard.firstbanknigeria.com/DashboardApi/api/", //live environment
   local: "https://localhost:44390/api/",
   mastercard: "http://10.111.29.232:8089/",
   local2: "http://172.16.27.217:8099/api/",
   local3: "http://172.16.248.18:8099/api/",
   local4: "http://10.0.20.149:8099/api/",
}
export const baseUrl = GLOBAL_API_URLS.local
export const queryLimit = process.env.NODE_ENV === 'development' ? 10 : 50

export function useFetchClient(apiURLKey?: keyof typeof GLOBAL_API_URLS) {
   const currentBaseURL = apiURLKey ? GLOBAL_API_URLS[apiURLKey] : GLOBAL_API_URLS.local
   const { authenticatedUser, signOut } = useAuth()
   let instance = axios.create({ baseURL: currentBaseURL })

   if (authenticatedUser) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${authenticatedUser.token}`;
   }

   instance.interceptors.response.use((response) => {
      return response
   }, (error) => {
      if (error.response?.status === 401) {
         // Expired or invalid token
         signOut("Session expired. Please sign in again")
      }

      return Promise.reject(error)
   })

   return instance;
}

interface UseFetchProps {
   url: string,
   queryKey: any[],
   baseURL?: keyof typeof GLOBAL_API_URLS,
   enabled?: boolean,
   keepPreviousData?: boolean,
   refetchInterval?: number | false
   errorMessage?: string,
   onSuccess?: Function
}
export function useFetch<T = _Object[]>({ enabled = true, keepPreviousData = false, refetchInterval = false, ...props }: UseFetchProps) {
   const handleFetch = useHandleFetch(props.baseURL, props.queryKey, props.url)

   const query = useQuery(props.queryKey, {
      enabled,
      retry: false,
      queryFn: handleFetch,
      keepPreviousData,
      refetchInterval,
      onSuccess: (data: unknown) => {
         data && props.onSuccess?.(data)
      }
   })

   const data = query.data as T
   return { ...query, data }
}

interface UseMutateProps extends Pick<UseFetchProps, 'baseURL'> {
   url: string,
   refetchKey?: any[],
   onSuccessCallback?: (arg: any) => void,
   successMessage?: string,
   errorMessage?: string,
   method?: "get" | "post" | "put" | "delete",
}
export function useMutate(props: UseMutateProps) {
   const fetchClient = useFetchClient(props.baseURL)
   const queryClient = useQueryClient()
   const { notify } = useToast()

   const mutation = useMutation(data =>
      fetchClient[props.method ?? 'post'](props.url, data as any),
      {
         onSuccess: (data) => {
            props.onSuccessCallback?.(data?.data)
            if (props.refetchKey) queryClient.invalidateQueries(props.refetchKey)
            notify({ message: props.successMessage ?? "Request processed successfully" })
         },
         onError: (error: any) => {
            notify({
               message: props.errorMessage ?? "An error occurred!",
               variant: "error"
            })
            console.error("error!--->", error.message)
         }
      }
   )

   return mutation
}

export function useInfiniteFetch(props: UseFetchProps) {
   const { notify } = useToast()
   const resTemplate = { pages: [], pageParams: [] }
   const handleFetch = useHandleFetch(props.baseURL, props.queryKey, props.url)

   const { data = resTemplate, ...query } = useInfiniteQuery({
      enabled: props.enabled,
      retry: false,
      queryKey: props.queryKey,
      queryFn: handleFetch,
      onError: (err: any) => {
         err.message && notify({
            message: `Error: ${err.message}`,
            variant: "error"
         })
      }
   })

   return { data, ...query }
}

function useHandleFetch(baseURL: UseFetchProps['baseURL'], key: UseFetchProps['queryKey'], url: string) {
   const { notify } = useToast()
   const fetchClient = useFetchClient(baseURL)

   return async () => {
      try {
         if (key) { //decodeURI is required here
            if (sanitizeUnsafeText(decodeURI(url))) {
               const response = await fetchClient.get(url)
               return response.data
            } else {
               notify({
                  message: "Unsafe query parameter detected!",
                  variant: "error"
               })
            }
         }
      } catch (error: any) {
         let message = ''
         switch (error.response?.status) {
            case 401:
               message = 'Unauthorized!'
               break;
            case 403:
               // message = 'Request not permitted for your account'
               break;
            case 404:
               message = 'Not found!'
               break;
            case 405:
               // message = 'Request not allowed!'
               break;
            default:
               message = `Failed to fetch ${key[0]}`
               break;
         }
         notify({ message, variant: "error", duration: 6000 })
         console.error(error)
      }
   }
}