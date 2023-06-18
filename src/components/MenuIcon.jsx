import { useStore } from '../contexts/Store.context'
import { AiOutlineMenu } from 'react-icons/ai'

export default function MenuIcon({ color }) {
    const { toggleSidebar } = useStore()
    return (
        <AiOutlineMenu
            onClick={toggleSidebar}
            aria-label="sidebar-toggle"
            className={`text-${color} text-2xl flex-shrink-0 cursor-pointer`}
        />
    )
}
