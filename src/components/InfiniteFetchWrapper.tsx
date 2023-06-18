import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GLOBAL_API_URLS, queryLimit, useInfiniteFetch } from "../lib/fetch";
import Table, { TableProps } from "./Table";
import Editable, { EdiTableProps } from "./Editable";

type Props = {
   url: string
   queryKey: any[]
   enabled?: boolean
   queryString?: string
   tableProps: TableProps | EdiTableProps,
   baseURL?: keyof typeof GLOBAL_API_URLS
}

export default function useInfiniteFetchWrapper({ queryString = "", enabled = true, ...props }: Props) {
   const queryClient = useQueryClient()
   const [offset, setOffset] = useState(0)
   const [data, setData] = useState<_Object[]>([])
   const queryKey = [...props.queryKey, props.url, queryString]
   const separator = props.url?.indexOf("?") > 0 ? "&" : "?"

   const { data: { pages, pageParams }, ...fetcher } = useInfiniteFetch({
      baseURL: props.baseURL,
      url: props.url + separator + `offset=${offset}&limit=${queryLimit}${queryString ? ("&" + queryString) : ""}`,
      enabled: !!props.url && enabled,
      queryKey: queryKey,
   })

   useEffect(() => {
      /**
       * offset is initialized with 1 on mount, but previously fetched data is persisted,
       * still showing and out of sync with current offset, so fetchNext() is also out of sync.
       * Best to clear the cache on first mount only. 
      */
      return () => queryClient.removeQueries(queryKey, { exact: true })
   }, []);

   useEffect(() => {
      /**
       * Important to note that @tanstack/react-query keeps track of its own pageParam state internally, but we
       * need our own offset param too hence this useEffect. Otherwise simply calling fetchNextPage() is enough.
       * Do not trigger fetchNext on mount. ReactQuery will be running a fetch already
      */
      if (offset >= 1) fetcher.fetchNextPage({ pageParam: offset })
   }, [offset]);

   useEffect(() => {
      if (pages.length) { //we've fetched at least one dataset
         const map = new Map()
         const merged: typeof data = []
         pages.forEach((data, i) => map.set(pageParams[i] ?? 0, data)) //key here must start with 0, same as offset
         map.forEach(entry => Array.isArray(entry) && merged.push(...entry))
         merged.length && setData(merged)
      }
   }, [pageParams, pages])

   const TableComponent = 'mutationUrl' in props.tableProps ? Editable : Table

   //@ts-ignore
   let table = <TableComponent
      {...props.tableProps}
      data={data}
      setOffset={setOffset}
      key={[queryKey, fetcher.isRefetching].toString()}
      isLoading={fetcher.isFetching || fetcher.isRefetching}
   />

   return {
      data,
      Table: table,
      refetch: fetcher.refetch,
      isLoading: fetcher.isFetching || fetcher.isRefetching
   }
}
