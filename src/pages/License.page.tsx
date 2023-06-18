import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../components/Button";
import { Input } from "../components/FormComponents";
import PageHeader from "../components/PageHeader";
import { useFetch, useMutate } from "../lib/fetch";
import { cx } from "../lib/utils";
import { BsShieldLock } from 'react-icons/bs'
import { queryKeys } from "../lib/config";

type License = {
   currentCode: string
   activatedOn: string
   expiresOn: string,
   daysRemaining: string | number,
   //for Post req payload
   code: string
   remark: string
}

export default function LicenseList() {
   const form = useForm<License>()
   const queryClient = useQueryClient()
   const queryKey = [queryKeys.license]

   const fetcher = useFetch<License>({
      url: `license/current`,
      queryKey
   })

   const mutation = useMutate({
      url: "license/activate",
      refetchKey: queryKey,
      successMessage: "License activated succesfully",
      onSuccessCallback: data => {
         queryClient.setQueryData(queryKey, data)
         form.reset()
      }
   })

   function handlePost(payload: License) {
      payload.remark = ''
      if (!mutation.isLoading) {
         mutation.mutate(payload as any)
      }
   }

   function renderLicense(license: License) {
      const elements = []
      for (const key in license) {
         let value = license[key as keyof License]
         if (key === 'daysRemaining' && Number.isFinite(+value)) {
            value = Math.max(0, +value)
         }
         elements.push(
            <div key={key}>
               <p className="text-gray-500 mb-1">
                  {key}:
               </p>
               <p className="font-bold p-4 bg-gray-50 text-blue-700 rounded-md">
                  {value}
               </p>
            </div>
         )
      }

      return elements
   }

   return (
      <div className="pb-4 flex flex-col h-full overflow-hidden text-gray-700">
         <PageHeader title='license information' children={undefined} />
         <div
            className="grid grid-cols-3 divide-x bg-white"
            style={{ minHeight: 500 }}
         >
            <div className="p-8 px-12 space-y-6 pb-8 w-full col-span-2">
               <h3 className="text leading-tight uppercase text-gray-600 border-b pb-4">
                  current license
               </h3>

               {
                  fetcher.isLoading ?
                     <p className="text-gray-500 italic">Please wait ...</p>
                     :
                     fetcher.data ?
                        <div className={cx("space-y-3")}>
                           {renderLicense(fetcher.data)}
                        </div>
                        :
                        <p>No valid license</p>
               }
            </div>
            <form
               onSubmit={form.handleSubmit(handlePost)}
               className="w-full space-y-6 p-12 flex flex-col"
            >
               <BsShieldLock className="text-4xl mx-auto" />
               <p className="text-center mb-14 uppercase tracking-wider">
                  Activate a new license
               </p>
               <Input
                  name="code"
                  showLabel={false}
                  register={form.register}
                  errors={form.formState.errors}
                  placeholder="Enter your license code"
                  required
               />
               <Button
                  type="submit"
                  fullWidth
                  className="w-full"
                  disabled={mutation.isLoading}
               >{mutation.isLoading ? 'Please wait ...' : 'activate'}</Button>
            </form>
         </div>
      </div>
   )
}