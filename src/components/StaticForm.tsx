import { useForm } from "react-hook-form"
import { FormData } from "./FormComponents"
import Button from './Button'
import { useMutate } from "../lib/fetch"
import { cx, sanitizeEntity } from "../lib/utils"
import Spinner from "./Spinner"
import { FiArrowRight } from "react-icons/fi"

interface Props {
   buttonText: string,
   data: _SearchFormInput[],
   mutationUrl: string
}

export default function StaticForm({ buttonText = "Create", ...props }: Props) {
   const { handleSubmit, register, formState: { errors } } = useForm()

   const { isLoading, mutate } = useMutate({
      url: props.mutationUrl,
      successMessage: "User created successfully",
      errorMessage: "There was an error creating user"
   })

   function onSubmit(values: _Object) {
      const sanitizedValues = sanitizeEntity(values, props.data)
      if (!isLoading) mutate(sanitizedValues as any)
   }

   return (
      <div className="relative w-full max-w-lg">
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-white p-8 rounded-lg border shadow"
         >
            <FormData
               data={props.data}
               defaultValues={{}}
               register={register}
               errors={errors}
            />
            <Button
               type="submit"
               disabled={isLoading}
               fullWidth
            >
               <span>
                  {isLoading ? "Processing..." : buttonText}
               </span>
               <FiArrowRight className="text-lg" />
            </Button>
         </form>
         {
            isLoading ?
               <div
                  className={cx(
                     "grid place-items-center bg-gray-100 bg-opacity-30",
                     "w-full h-full absolute top-0 left-0"
                  )}
               >
                  <Spinner />
               </div>
               : null
         }
      </div>
   )
}
