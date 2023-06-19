// import { useRef, useState } from "react"
// import { useForm } from "react-hook-form";
// import { Input } from "../../components/FormComponents";
// import Button from "../../components/Button";
// import { FiHardDrive } from "react-icons/fi";
// import Select from "../../components/Select";

// export default function CashEvacuated() {
//    const [file, setFile] = useState({ name: "", size: null })
//    const { handleSubmit, register, errors } = useForm()
//    const fileRef = useRef()

//    function onSubmit(v, e) {
//       e.preventDefault()
//       return null
//    }

//    function handleChange(e) {
//       if (e.target.files) {
//          const { name, size } = e.target.files[0]
//          setFile({ name, size })
//       }
//    }

//    return (
//       <div className="pt-8 pb-4 flex flex-col h-full overflow-y-auto scrollbar">
//          <div className="px-8 pb-8 h-full">
//             <form
//                onSubmit={handleSubmit(onSubmit)}
//                className="bg-white w-full max-w-md flex flex-col space-y-6 p-8 shadow rounded-lg"
//             >
//                <div className="space-y-3">
//                   <label htmlFor="file" className="block text-gray-500 text-sm">Choose file to upload</label>
//                   <Button variant="light-red" onClick={() => fileRef.current?.click()}>
//                      <FiHardDrive className="text-2xl" /><span>Choose File</span>
//                   </Button>
//                   <p className="text-sm text-gray-600 flex justify-between items-center space-x-2">
//                      <span className="truncate">{file.name}</span>
//                      <span className="text-gray-400 flex-shrink-0">{file.size ? parseInt(file.size / 1000).toLocaleString("en-GB") + " KB" : null}</span>
//                   </p>
//                </div>
//                <input
//                   ref={fileRef}
//                   name="file"
//                   type="file"
//                   onChange={handleChange}
//                   className="hidden"
//                />
//                {/* <Select
//                   type="brand"
//                   label="brand"
//                   register={register}
//                   errors={errors}
//                /> */}
//                <Input
//                   name="username"
//                   pattern="email"
//                   register={register}
//                   errors={errors}
//                   placeholder="Enter your username..."
//                   required
//                />
//                <Input
//                   name="password"
//                   type="password"
//                   register={register}
//                   errors={errors}
//                   placeholder="Enter your password..."
//                   required
//                />
//                <Button type="submit" fullWidth className="w-full">Upload</Button>
//             </form>
//          </div>
//       </div>
//    )
// }

import { useState } from "react"
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import Search from "../../components/Search"
import { useStore } from "../../contexts/Store.context"

const _key = 'atms-terminals'

export default function ContentManager() {
  const { statesList, brandsList } = useStore()
  const [searchTerm, setSearchTerm] = useState(null)
  const queryString = searchTerm ? `searchTerm=${searchTerm}` : ""

  const request = useInfiniteFetchWrapper({
    url: "atms/terminals",
    queryString,
    queryKey: [_key, searchTerm],
    tableProps: {
      data: [],
      headers: getTableHeaders(brandsList, statesList),
      mutationUrl: "atms/update",
      refetchKey: [_key],
      method: "put",
      hasConnect: true,
    }
  })

  return (
    <div className="pt-8 pb-4 space-y-4 flex flex-col h-full overflow-hidden">
      <div className="px-8 flex items-center space-x-4">
        <Search
          placeholder="Search Terminal ID or Sol ID..."
          isLoading={request.isLoading}
          search={setSearchTerm}
          refetch={request.refetch}
        />
      </div>
      <section className="px-8 flex-1 overflow-y-hidden">
        {request.Table}
      </section>
    </div>
  )
}

const getTableHeaders = (brands, states) => [
  {
    key: "terminalId",
    label: "terminal_id"
  },
  {
    key: "ipAddress",
    label: "ip_address",
    capitalize: false
  },
  {
    key: "solId",
    label: "sol_id"
  },
  { key: "shortName", label: "short_name" },
  // {
  //   key: "rdpUsername",
  //   label: "rdp_Username",
  //   capitalize: false
  // },
  // {
  //   key: "rdpPassword",
  //   label: "rdp_Password",
  //   capitalize: false,
  //   password: true,
  // }
]