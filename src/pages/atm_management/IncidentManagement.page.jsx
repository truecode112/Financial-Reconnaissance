import Table from "../../components/Table"
import { formatDate } from "../../lib/utils"

const tableHeaders = [
    {
        label: "date",
        orderBy: true,
        sticky: true,
        modifier: date => formatDate(String(date))
    },
    { label: "ticket_id" },
    { label: "assign_to" },
    { label: "fault_duration" },
    { label: "device", orderBy: true },
    { label: "device_status" },
    { label: "terminal_id" },
    { label: "state", orderBy: true },
]

export default function IncidentManagement() {

    return (
        <div className="pt-8 pb-4 flex flex-col h-full overflow-y-auto scrollbar">
            <section className="px-8 flex-1 overflow-y-hidden">
                <div className="h-full">
                    <Table headers={tableHeaders} />
                </div>
            </section>
        </div>
    )
}

