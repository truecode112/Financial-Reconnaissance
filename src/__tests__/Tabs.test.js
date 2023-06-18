import { cleanup, fireEvent, render } from "@testing-library/react";
import Tabs from "../components/Tabs";

describe("Tabs", () => {
    afterEach(() => {
        cleanup()
        jest.resetModules()
    })

    const setup = (index = 0, setIndex) => {
        const tabs = [
            { name: "Tab one" },
            { name: "Tab two" }
        ];

        const utils = render(
            <Tabs
                tabs={tabs}
                index={index}
                setIndex={setIndex}
            />
        )

        const tabOne = utils.getByTestId(tabs[0].name)
        const tabTwo = utils.getByTestId(tabs[1].name)
        return { tabs, tabOne, tabTwo, ...utils }
    }

    it("Displays tabs correctly", () => {
        const { tabs, tabOne, tabTwo } = setup()
        expect(tabOne).toHaveTextContent(tabs[0].name)
        expect(tabTwo).toHaveTextContent(tabs[1].name)
    })

    it("Updates index on click", () => {
        let index = 0
        const setIndex = (num) => index = num
        const { tabTwo } = setup(index, setIndex)

        fireEvent.click(tabTwo)
        expect(index).toBe(1)
    })

    it("Fails to update on incorrect setState function", () => {
        let index = 0
        const setIndex = () => null
        const { tabOne, tabTwo } = setup(index, setIndex)

        fireEvent.click(tabOne)
        fireEvent.click(tabTwo)
        expect(index).toBe(0)
    })
})