import { useMutate } from "../lib/fetch";
import StaticForm from "../components/StaticForm";
import { useStore } from "../contexts/Store.context";

// POSTurl="passport/register"

export default function Login() {
    const { statesList, rolesList } = useStore()

    const formInputs = [
        { name: "sol_id" },
        { name: "staff_ID", label: "Staff ID (without email address)" },
        { name: "state", type: "select", initialOptions: statesList },
        { name: "role", type: "radio", options: rolesList },
        { name: "password", type: "password" }
    ]

    const { isLoading, error, mutate } = useMutate({
        url: "passport/register",
        successMessage: "User created successfully",
    })

    const onSubmit = async (values, e) => {
        e.preventDefault()
        if (!isLoading) mutate(values)
    }

    return (
        <div className="p-8 space-y-8 flex flex-col flex-1 overflow-y-auto scrollbar">
            <StaticForm buttonText="Create user" data={formInputs} />
        </div>
    )
}