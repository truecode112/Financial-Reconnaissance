import { render } from "@testing-library/react";
import { cleanup } from "axe-core";
import { FormData } from "../components/FormComponents";

describe('Dynamic Form', () => {
    afterEach(() => {
        cleanup()
        jest.resetModules()
    })

    const mockRegister = jest.fn((element) => element)

    const setup = () => {
        const formInputs = [
            { name: "terminal" },
            {
                type: "radio",
                name: "region",
                options: [
                    { label: "north", value: 1 },
                    { label: "south", value: 2 }
                ]
            },
            {
                name: "state",
                type: "select",
                initialOptions: [{ label: 'lagos', value: 'lagos' }]
            },
        ]

        const utils = render(
            <FormData
                data={formInputs}
                register={mockRegister}
                errors={{}}
            />
        )

        const textbox = utils.getByRole("textbox", { name: /terminal/i })
        const radio = utils.getByRole("radio", { name: /north/i })
        const select = utils.getByRole("combobox", { name: /state/i })

        return { textbox, radio, select, utils }
    }

    it("Renders approprirate form elements", () => {
        const { textbox, radio, select } = setup()
        const elems = [textbox, radio, select]
        elems.forEach(el => expect(el).toBeInTheDocument())
        expect(mockRegister).toBeCalled()
    })
})
