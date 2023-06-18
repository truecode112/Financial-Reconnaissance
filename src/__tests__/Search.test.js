import { cleanup, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../components/Search";
import { ToastProvider } from "../contexts/Notification.context";

describe("Search", () => {
    afterEach(() => {
        cleanup()
        jest.resetModules()
    })

    const mockSearch = jest.fn((query) => {
        return query
    })

    function setup({ isLoading } = {}) {
        const utils = render(
            <ToastProvider>
                <Search
                    search={mockSearch}
                    isLoading={isLoading}
                    placeholder="search-input"
                />
            </ToastProvider>
        )

        const searchIcon = utils.getByLabelText(/search-icon/i)
        const searchInput = utils.getByRole("textbox", { name: /search-input/i })
        const submitButton = utils.getByRole("button", { name: /search-button/i })

        return { searchIcon, searchInput, submitButton, utils }
    }

    it("Should render an input, button and icon", () => {
        const { searchIcon, submitButton, searchInput } = setup()
        expect(searchIcon).toBeInTheDocument()
        expect(searchInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
    })

    it("Enabled search button when input is not empty", async () => {
        const { submitButton, searchInput } = setup()
        expect(submitButton).toBeDisabled()

        fireEvent.change(searchInput, { target: { value: "123" } })
        expect(submitButton).toBeEnabled()

        fireEvent.change(searchInput, { target: { value: "" } })
        expect(submitButton).toBeDisabled()
    })

    it("Perform a search function", async () => {
        const { submitButton, searchInput } = setup()
        const value = 1234

        fireEvent.change(searchInput, { target: { value } })
        expect(submitButton).toBeEnabled()

        userEvent.click(submitButton, { button: 0 })
        expect(mockSearch).toBeCalled()
        //all inputs are converted to strings by default
        expect(mockSearch).toBeCalledWith(String(value))
    })

    it("Button should be disabled if isLoading", async () => {
        const { submitButton, searchInput } = setup({ isLoading: true })
        const value = 1234

        fireEvent.change(searchInput, { target: { value } })
        expect(submitButton).toBeDisabled()

        userEvent.click(submitButton, { button: 0 })
        expect(mockSearch).not.toBeCalled()
    })

})