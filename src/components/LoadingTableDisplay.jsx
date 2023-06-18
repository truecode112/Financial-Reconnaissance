import { useState, useEffect } from "react"

export default function LoadingTableDisplay({ tableHead = new Array(8).fill("x"), checkAll }) {
    return (
        tableHead.slice(0, 10).map((elem, i) => <TableRow key={elem + i} tableHead={tableHead} checkAll={checkAll} />)
    )
}

function TableRow({ tableHead, checkAll }) {
    const [status, setStatus] = useState(false)

    useEffect(() => {
        setStatus(checkAll)
    }, [checkAll]);

    return (
        <tr className="py-5 h-20">

            {
                tableHead.map((y, j) => <td key={y + j} className="px-4 space-y-2 animate-pulse">
                    {
                        y.toLowerCase() === "status" ? <span className={`block w-3 h-3 rounded-full bg-gray-300`}></span> :
                            <>
                                <div style={{ width: 80 }} className={`h-2 rounded bg-gray-300`}></div>
                                <div style={{ width: 50 }} className={`h-1.5 rounded ${status ? "bg-red-200" : "bg-gray-200"}`}></div>
                            </>
                    }
                </td>
                )
            }
            <td className="px-4">
                <input
                    type="checkbox"
                    value="claim ownership"
                    checked={status}
                    onChange={null}
                    onClick={() => setStatus(st => !st)}
                    className="rounded text-red-600 cursor-pointer"
                />
            </td>
        </tr>
    )
}