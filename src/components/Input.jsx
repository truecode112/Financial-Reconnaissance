
export default function Input({ type, name, ref }) {
    return (
        <input
            ref={ref}
            name={name}
            type={type ?? "text"}
            className={`h-12 w-full rounded-md text-gray-600  border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
        />
    )
}
