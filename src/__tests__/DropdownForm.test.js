import { fireEvent, render, waitFor } from "@testing-library/react";
import SearchForm from "../components/SearchForm"
import { ToastProvider } from "../contexts/Notification.context";

describe("DropdownForm", () => {
   const setup = (search) => {
      const formInputs = [
         { name: "date_from", type: "date" },
         { name: "terminal_id" },
         {
            type: "radio",
            name: "region",
            options: [
               { label: "north", value: 1 },
               { label: "south", value: 2 }
            ]
         },
      ]

      const utils = render(
         <ToastProvider>
            <SearchForm
               data={formInputs}
               label="dropdown-open"
               search={search}
            />
         </ToastProvider>
      )

      const openButton = utils.getByRole('button', { name: /dropdown-open/i })
      fireEvent.click(openButton)

      const dateInput = utils.getByLabelText(/date/i)
      const terminalInput = utils.getByLabelText(/terminal/i)
      const radioInput = utils.getByRole("radio", { name: /north/i })
      const submitButton = utils.getByRole('button', { name: /search/i })
      const closeButton = utils.getByRole('button', { name: /close/i })

      return { dateInput, terminalInput, radioInput, submitButton, openButton, closeButton, utils }
   }

   it("Opens the dropdown form", () => {
      const { submitButton, closeButton, dateInput } = setup()
      const elems = [dateInput, submitButton, closeButton]
      elems.forEach(el => expect(el).toBeInTheDocument())
   })

   it("Performs query search", async () => {
      let query
      const setQuery = (st) => query = st

      const { submitButton, dateInput, radioInput, terminalInput } = setup(setQuery)
      fireEvent.change(dateInput, { target: { value: "2021-10-13" } })
      fireEvent.change(terminalInput, { target: { value: "terminal" } })
      fireEvent.click(radioInput)
      await waitFor(() => fireEvent.click(submitButton))
      expect(query).toMatch("dateFrom=2021-10-13&terminalID=terminal&region=1")
   })

   it("Closes the dropdown form", async () => {
      const { submitButton, closeButton, dateInput } = setup()
      const elems = [dateInput, submitButton, closeButton]
      fireEvent.click(closeButton)

      for (const node of elems) {
         await waitFor(() => expect(node).not.toBeInTheDocument())
      }
   })
})