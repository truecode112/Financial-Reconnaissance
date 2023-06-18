import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from 'history';
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "react-router-dom";
import { AuthProvider } from "../contexts/Auth.context";
import { ToastProvider } from "../contexts/Notification.context";
import { StoreProvider } from "../contexts/Store.context";
import { queryClientConfig } from "../lib/utils";
import Header from "../pages/Header";
import Login from "../pages/Login";
import ExceptionPage from "../pages/transaction_management/Exception.page";

describe("Header", () => {
   afterEach(() => {
      cleanup()
      jest.resetModules()
   })

   const setup = (useIsFetching) => {
      const history = createMemoryHistory()

      const utils = render(
         <Router history={history}>
            <QueryClientProvider client={queryClientConfig}>
               <AuthProvider>
                  <ToastProvider>
                     <StoreProvider>
                        <Header />
                        {
                           //use a component that auto-fetches data on mount to trigger isFetching
                           useIsFetching && <ExceptionPage />
                        }
                        <Route exact path="/login"><Login /></Route>
                     </StoreProvider>
                  </ToastProvider>
               </AuthProvider>
            </QueryClientProvider>
         </Router>
      )

      const logoutButton = utils.getByRole("button", { name: "logout" })
      const greeting = utils.getByText(/hello/i)
      return { logoutButton, greeting, history, utils }
   }

   it("Renders a header with greeting & logout button", () => {
      const { greeting, logoutButton, utils } = setup()
      const brandName = utils.getByText(/camguard/i);
      const hello = utils.getByText(/hello/i)
      const arr = [greeting, hello, brandName, logoutButton]
      arr.forEach(el => expect(el).toBeInTheDocument())
   })

   it("Displays a spinner when fetching data", async () => {
      const { utils } = setup(true)
      const spinner = utils.queryByLabelText(/spinner/i)
      await waitFor(() => expect(spinner).not.toBeNull())
   })

   it("Navigates to login screen when logout button is clicked", async () => {
      const { logoutButton, utils } = setup()
      userEvent.click(logoutButton, { button: 0 })
      await waitFor(() => {
         const usernameInput = utils.getByLabelText(/username/i)
         const passwordInput = utils.getByLabelText(/password/i)
         const submitButton = utils.getByRole('button', { name: /sign in/i })
         const arr = [usernameInput, passwordInput, submitButton]
         arr.forEach(el => expect(el).toBeInTheDocument())
      })
   })
})