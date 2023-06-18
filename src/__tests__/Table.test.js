import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Table from "../components/Table";
import { AuthProvider } from "../contexts/Auth.context";
import { ToastProvider } from "../contexts/Notification.context";
import { queryLimit } from "../lib/fetch";
import { queryClientConfig } from "../lib/utils";

describe("Table", () => {
   afterEach(() => {
      cleanup()
      jest.resetModules()
   })

   const setup = ({ mockOffset, updateSelection = () => null, claim } = {}) => {
      const tableData = [
         { label: "terminalId" },
         { label: "brand" },
         { label: "region" },
         { label: "state" },
      ]
      const defaultData = {
         "terminalId": "17013281",
         "brand": "NCR",
         "region": "South",
         "state": "Abia",
      }

      const utils = render(
         <QueryClientProvider client={queryClientConfig}>
            <AuthProvider>
               <ToastProvider>
                  <Table
                     headers={tableData}
                     data={[defaultData]}
                     setOffset={mockOffset}
                     updateSelection={updateSelection}
                     claim={claim}
                  />
               </ToastProvider>
            </AuthProvider>
         </QueryClientProvider>,
         { wrapper: MemoryRouter }
      )

      const headers = tableData.map(({ label }) => utils.getByRole("columnheader", { name: label }))
      const cells = tableData.map(({ label }) => utils.getByRole("cell", { name: label }))
      const loadMoreButton = utils.getByRole("button", { name: "load-more" })
      return { headers, cells, loadMoreButton, defaultData, utils }
   }

   it("Displays table correctly", () => {
      const { headers, cells, loadMoreButton } = setup()
      headers.every(el => expect(el).toBeInTheDocument())
      cells.every(el => expect(el).toBeInTheDocument())
      expect(loadMoreButton).toBeInTheDocument()
   })

   it("Increments offset correctly", () => {
      let cursor = 15, offset = cursor;
      const mockOffset = jest.fn((x) => offset = x(offset))

      const { loadMoreButton } = setup({ mockOffset })

      fireEvent.click(loadMoreButton)
      expect(mockOffset).toBeCalled()
      expect(offset).toEqual(queryLimit + cursor)
   })

   it("Select-all checkbox selects and deselects all child checkboxes", async () => {
      const { utils } = setup({ claim: true })
      const checkboxAll = utils.getByRole("checkbox", { name: /select-all/i })
      const checkbox = utils.getByRole("checkbox", { name: /selection/i })

      fireEvent.click(checkboxAll)
      await waitFor(() => expect(checkbox).toBeChecked())

      fireEvent.click(checkboxAll)
      await waitFor(() => expect(checkbox).not.toBeChecked())
   })

   it("Updates selections correctly", () => {
      let records = {}, count = 0;
      const updateSelection = jest.fn((payload) => {
         if (payload) records[count] = payload
         count++
      })
      const { defaultData, utils } = setup({ updateSelection, claim: true })

      const checkbox = utils.getByRole("checkbox", { name: /selection/i })
      fireEvent.click(checkbox)
      //click event will be fired 3 times by jest. Every even-numbered update has payload, else undefined
      expect(updateSelection).toBeCalled()
      expect(records[0]).toStrictEqual(defaultData)
      expect(records[1]).toBeUndefined()
   })
})