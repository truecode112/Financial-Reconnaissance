import { useState } from "react"
import { FiDownload } from "react-icons/fi"
import Button from "../../components/Button"
import SearchForm from "../../components/SearchForm"
import ImagePreviewer from "../../components/ImagePreviewer"
import useInfiniteFetchWrapper from "../../components/InfiniteFetchWrapper"
import PagePrintWrapper from "../../components/PagePrintWrapper"
import { useFetch } from "../../lib/fetch"
import { formatDateTime, textToPDF } from "../../lib/utils"
import useBoxes from "../../components/useBoxes"

const components: _BoxComponent[] = [
   { title: "Journal Search", component: JournalSearch },
   { title: "Footage Search", component: FootageSearch }
]

export default function JournalFootageSearch() {
   const boxes = useBoxes({ components })
   const ActiveComponent = components[boxes.index].component

   return (
      <div className="h-full flex flex-col">
         {boxes.Tabs}
         <div className="px-8 py-4 space-y-4 flex flex-col flex-1 overflow-y-auto scrollbar">
            <ActiveComponent />
         </div>
      </div>
   )
}

function JournalSearch() {
   const [queryString, setQueryString] = useState<string>()

   const { data: logText, isFetching, refetch } = useFetch<string>({
      queryKey: [`journals`, queryString],
      url: `journals?${queryString}`,
      enabled: !!queryString,
   })

   const formInputs: _SearchFormInput[] = [
      { name: "date", type: "date", required: true },
      { name: "terminal_id", required: true },
      { name: "rrn", acronym: true },
      { name: "sequence_number" },
      { name: "account_number" },
      {
         name: "pan",
         acronym: true,
         type: "group",
         options: [
            { name: "first_6", placeholder: "First six (6)" },
            { name: "last_4", placeholder: "Last four (4)" }
         ]
      },
   ]

   function handleExport() {
      if (logText?.length && queryString) {
         return textToPDF({ text: logText, filename: `journal-${queryString.replace(/&|=/g, "_")}` })
      }
   }

   return (
      <>
         <div className="flex justify-between">
            <SearchForm
               data={formInputs}
               search={setQueryString}
               refetch={refetch}
            />
            {
               logText?.length ?
                  <span>
                     <Button
                        variant="light"
                        onClick={handleExport}
                        disabled={isFetching}
                     >
                        <FiDownload className="text-lg flex-shrink-0" />
                        <span>Export to PDF</span>
                     </Button>
                  </span> : null
            }
         </div>
         <section className="flex-1 p-2 bg-white rounded-lg border overflow-y-hidden shadow-lg">
            <div className="h-full p-6 overflow-y-auto scrollbar space-y-2">
               <pre className="text-sm text-gray-600">
                  {logText}
               </pre>
            </div>
         </section>
      </>
   )
}

function FootageSearch() {
   type ExportData = { header: string[], fileName: string, data: string[][] }

   const [queryString, setQueryString] = useState<string>()
   const [previewImageSrc, setPreviewImageSrc] = useState()
   const [imageLinks, setImageLinks] = useState<string[]>()
   const [exportData, setExportData] = useState<ExportData>()

   const tableHeaders: _TableHeader[] = [
      {
         label: "date_time",
         key: "date",
         orderBy: true,
         sticky: true,
         modifier: date => formatDateTime(String(date))
      },
      { label: "image_name", capitalize: false },
      {
         key: "imageKey",
         label: "image_link",
         capitalize: false,
         elementType: {
            name: "imageSrc",
            open: (src) => setPreviewImageSrc(src),
            close: () => setPreviewImageSrc(undefined),
            openInline: true,
         },
      },
      { label: "pan" },
   ]

   const formInputs: _SearchFormInput[] = [
      { name: "date", type: "date", required: true },
      { name: "terminal_id", required: true },
      {
         name: "pan",
         acronym: true,
         type: "group",
         options: [
            { name: "first_6", placeholder: "First six (6)" },
            { name: "last_4", placeholder: "Last four (4)" }
         ]
      },
   ]

   const queryData = useInfiniteFetchWrapper({
      url: 'footages',
      queryString,
      enabled: !!queryString,
      queryKey: [queryString],
      tableProps: {
         data: [],
         headers: tableHeaders
      }
   })

   function handleExport() {
      const data = queryData.data
      const arr: string[] = []
      const info: ExportData = {
         header: ["Terminal", "Location", "Transaction Date"],
         fileName: `Camguard_footages_${queryString?.replace(/&|=/g, "_")}`,
         data: []
      }
      if (data) {
         data.forEach((img, i) => {
            arr.push(img["imageKey"])
            //Collect first and last entry
            if (i === 0 || (i > 0 && i === data.length - 1)) {
               info.data.push([
                  img["terminalID"],
                  img["location"],
                  formatDateTime(img["date"], "M/dd/yyyy hh:mm:ss aa")
               ])
            }
         })
         setExportData(info)
      }
      setImageLinks(arr)
   }

   return (
      <>
         <div className="flex justify-between">
            <SearchForm
               data={formInputs}
               search={setQueryString}
               refetch={queryData.refetch}
            />
            {
               queryData.data?.length ?
                  <span>
                     <Button variant="light-blue" onClick={handleExport}>
                        <FiDownload className="text-lg flex-shrink-0" />
                        <span>Generate PDF</span>
                     </Button>
                  </span> : null
            }
         </div>
         {queryData.Table}
         {
            previewImageSrc ?
               <ImagePreviewer
                  imageSrc={previewImageSrc}
                  close={() => setPreviewImageSrc(undefined)}
               />
               : null
         }
         {
            imageLinks?.length ?
               <PagePrintWrapper
                  imageLinks={imageLinks}
                  exportData={exportData}
                  close={() => setImageLinks(undefined)}
               />
               : null
         }
      </>
   )
}

