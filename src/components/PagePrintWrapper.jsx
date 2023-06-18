import { useRef } from "react"
import { motion } from 'framer-motion'
import { useReactToPrint } from "react-to-print"
import BrandLogo from "../components/BrandLogo"
import Button from './Button'
import { FiX } from "react-icons/fi"

export default function PagePrintWrapper({ imageLinks, exportData, close }) {
    const printRef = useRef()

    // I need images to move to a new page entirely instead of being cut off. 
    // For this each row needs to be rendered separately.
    let perRow = 3, chunks = [];
    for (let i = 0; i < imageLinks.length;) {
        const row = imageLinks.slice(i, i + perRow);
        chunks.push(row)
        i += perRow
    }

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    })

    return (
        <div
            className="absolute p-6 top-0 left-0 bg-gray-500 bg-opacity-50 h-screen w-screen flex justify-center"
            style={{ zIndex: 222, margin: 0 }}
        >
            <motion.div
                className={`flex border-gray-200 shadow-2xl rounded-xl overflow-hidden`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div ref={printRef} className="bg-white p-8 space-y-4 flex-1 overflow-y-scroll scrollbar" style={{ width: 1080 }}>
                    <div className="flex justify-between py-6">
                        <div className="space-y-4 flex flex-col justify-between">
                            <BrandLogo dark />
                            <h2>
                                <span className="block uppercase font-bold text-sm tracking-wider text-gray-500">Footage Report</span>
                                <span className="block text-xs font-bold text-gray-400">{exportData.fileName}</span>
                            </h2>
                        </div>
                        <TableDisplay exportData={exportData} />
                    </div>
                    {
                        chunks.map((row, i) =>
                            <div key={i} className="w-full grid grid-cols-3 gap-4" style={{ maxHeight: 400 }}>
                                {
                                    row.map((link, j) =>
                                        <img key={j} src={link} alt="ATM capture footage" className="object-cover w-full" />
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col justify-between bg-gray-800 px-6 py-6 space-y-2" style={{ width: 280 }}>
                    <span onClick={close} className="text-gray-200 self-end w-10 h-10 border border-gray-500 rounded-full grid place-items-center cursor-pointer">
                        <FiX className="text-2xl" />
                    </span>
                    <Button onClick={handlePrint}>Save to PDF</Button>
                </div>
            </motion.div>
        </div>
    )
}

function TableDisplay({ exportData }) {
    return (
        <table className="bg-white w-full border-collapse max-w-lg border">
            <thead>
                <tr>
                    {
                        exportData.header.map(header =>
                            <th key={header} className="bg-gray-100 font-bold h-14 px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                {header}
                            </th>
                        )
                    }
                </tr>
            </thead>
            <tbody>
                {
                    exportData.data.map((row, i) =>
                        <tr key={i}>
                            {
                                row.map((cell, j) =>
                                    <td key={j} className="h-14 px-6 py-3 text-left text-sm text-gray-600 border-t">
                                        {cell}
                                    </td>)
                            }
                        </tr>
                    )
                }
            </tbody>
        </table>
    )
}