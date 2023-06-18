import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import { queryLimit } from "../lib/fetch";

export default function PaginationControls({ offset, setOffset, totalCount = 5000, isLoading }) {
    const maxOffset = Math.floor(totalCount / queryLimit)
    const controlStyles = (condition) => `h-12 flex-shrink-0 grid place-items-center px-4 border bg-white text-lg rounded-lg ${condition ? "text-gray-300 cursor-default pointer-events-none" : "cursor-pointer"}`

    return (
        <ul className="flex w-full space-x-1 select-none">
            <li className={controlStyles(offset <= 0)} onClick={() => offset > 0 && setOffset(0)}><FiChevronsLeft /></li>
            <li className={controlStyles(offset <= 0)} onClick={() => offset > 0 && setOffset(n => n - 1)}>
                <IoIosArrowBack />
            </li>
            <li className="h-12 flex-shrink-0 grid place-items-center px-10">{~~(offset + 1)}</li>
            <li className={controlStyles(offset >= maxOffset)} onClick={() => offset < maxOffset - 1 && setOffset(n => n + 1)}>
                <IoIosArrowForward />
            </li>
            {
                // <>
                //     <li className={controlStyles(offset >= maxOffset)} onClick={() => setOffset(maxOffset)}><FiChevronsRight /></li>
                //     <li className="grid place-items-center text-gray-400 px-6">Entries: {~~totalCount}, Pages: {~~dataCount}, Max Offset: {~~maxOffset}, Offset: {~~offset}</li>
                // </>
            }
        </ul>
    );
}