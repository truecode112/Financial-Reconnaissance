import { cleanup, fireEvent, render } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Editable from "../components/Editable";
import { AuthProvider } from "../contexts/Auth.context";
import { ToastProvider } from "../contexts/Notification.context";
import { queryLimit } from "../lib/fetch";
import { queryClientConfig } from "../lib/utils";

describe("Editable", () => {
   afterEach(() => {
      cleanup()
      jest.resetModules()
   })

   const mockMutation = jest.fn((terminal, ipAddress, solId) => {
      return Promise.resolve({ terminal, ipAddress, solId });
   })

   const setup = (setOffset) => {
      const tableData = [
         { label: "terminalId" },
         { label: "brand", type: "static" },
         { label: "region" },
         { label: "state" },
      ]
      const defaultData = [
         {
            "terminalId": "17013281",
            "brand": "NCR",
            "region": "South",
            "state": "Abia",
         }
      ]

      const utils = render(
         <QueryClientProvider client={queryClientConfig}>
            <AuthProvider>
               <ToastProvider>
                  <Editable
                     headers={tableData}
                     mockMutation={mockMutation}
                     setOffset={setOffset}
                     data={[defaultData]}
                  />
               </ToastProvider>
            </AuthProvider>
         </QueryClientProvider>,
         { wrapper: MemoryRouter }
      )

      const headers = tableData.map(({ label }) => utils.getByRole("columnheader", { name: label }))
      const cells = tableData.map(({ label }) => utils.getByRole("cell", { name: label }))
      const cell = utils.getByLabelText(/terminal/i)
      const loadMoreButton = utils.getByRole("button", { name: "load-more" })
      return { headers, cell, cells, loadMoreButton, utils }
   }

   it("Displays table correctly", () => {
      const { headers, cells, loadMoreButton } = setup()
      headers.every(el => expect(el).toBeInTheDocument())
      cells.every(el => expect(el).toBeInTheDocument())
      expect(loadMoreButton).toBeInTheDocument()
   })

   it("Converts table cells to editable form inputs", async () => {
      const { cell, utils } = setup()
      fireEvent.click(cell)

      const textbox = await utils.findByRole("textbox", { name: /terminalid/i })
      expect(textbox).toBeInTheDocument()
      expect(textbox).toBeVisible()
   })

   it("Does not convert static cells to editable form inputs", async () => {
      const { utils } = setup()
      const cell = utils.getByLabelText(/brand/i)
      fireEvent.click(cell)
      expect(utils.queryByRole("textbox", { name: /brand/i })).toBeNull()
   })

   it("Does not perform mutation on unedited data", async () => {
      const { cell, utils } = setup()
      fireEvent.click(cell)
      const button = await utils.findByRole("button", { name: /update/i })
      fireEvent.click(button)
      expect(mockMutation).not.toBeCalled()
   })

   it("Performs mutation on edited data", async () => {
      const { cell, utils } = setup()
      fireEvent.click(cell)
      const textbox = await utils.findByRole("textbox", { name: /terminalid/i })
      const button = await utils.findByRole("button", { name: /update/i })

      fireEvent.change(textbox, { target: { value: "1234" } })
      fireEvent.click(button)

      expect(mockMutation).toBeCalled()
   })

   it("Increments offset correctly", async () => {
      let cursor = 15, offset = cursor;
      const setOffset = jest.fn((x) => offset = x(offset))

      const { loadMoreButton } = setup(setOffset)

      fireEvent.click(loadMoreButton)

      expect(setOffset).toBeCalled()
      expect(offset).toEqual(queryLimit + cursor)
   })
})