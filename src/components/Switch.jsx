import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";

export default function Switcher({ states, setValue, color, capsTitle, initialState }) {
    const [switchValue, setSwitchValue] = useState(initialState ?? false);
    const selected = switchValue ? states?.[0] : states?.[1]

    useEffect(() => {
        //if states["",""] tuple prop is not passed setValue will default to true or false boolean
        setValue(selected ?? switchValue)
        //eslint-disable-next-line
    }, [switchValue]);

    const bgColor = switchValue ? `bg-${color ?? "indigo"}-600` : `bg-gray-200`

    return (
        <Switch.Group as="div" className="flex items-center space-x-4">
            <Switch.Label className={capsTitle ? "uppercase tracking-wider text-sm" : "capitalize"}>{selected}</Switch.Label>
            <Switch
                as="button"
                checked={switchValue}
                onChange={setSwitchValue}
                className={`
                    ${bgColor} relative inline-flex flex-shrink-0 h-8 transition-colors duration-200 ease-in-out 
                    border-2 border-transparent rounded-full cursor-pointer w-16 focus:outline-none focus:shadow-outline
                `}
            >
                {({ checked }) => (
                    <span className={`
                        ${checked ? "translate-x-8" : "translate-x-0"} 
                        inline-block w-7 h-7 transition duration-200 ease-in-out transform bg-white rounded-full
                    `} />
                )}
            </Switch>
        </Switch.Group>
    );
}