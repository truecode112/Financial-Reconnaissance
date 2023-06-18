import { QueryCache, QueryClient } from '@tanstack/react-query'

export const queryKeys = {
   archive: 'archive',
   license: 'license',
   archiveStatus: ['archive', 'status']
}

export const queryClientConfig = new QueryClient({
   queryCache: new QueryCache({
      // onError: error => console.error(error.response),
   }),
   defaultOptions: {
      queries: {
         // retry: false,
         // throwOnError: false,
         useErrorBoundary: false,
         refetchOnWindowFocus: false,
         refetchOnReconnect: true,
         networkMode: 'offlineFirst'
      }
   }
})

export const buttonHeight = 'h-8'