import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from '../contexts/Auth.context';
import { queryClientConfig } from '../lib/utils';
import Login from "../pages/Login";

describe("Login", () => {
   afterEach(() => {
      cleanup()
      jest.resetModules()
   })

   const mockLogin = jest.fn((email, password) => {
      return Promise.resolve({ email, password });
   })

   const setup = () => {
      const utils = render(
         <QueryClientProvider client={queryClientConfig}>
            <AuthProvider>
               <Login mockLogin={mockLogin} />
            </AuthProvider>
         </QueryClientProvider>,
         { wrapper: MemoryRouter }
      )
      const usernameInput = utils.getByLabelText(/username/i)
      const passwordInput = utils.getByLabelText(/password/i)
      const submitButton = utils.getByRole('button', { name: /sign in/i })
      return { usernameInput, passwordInput, submitButton, ...utils }
   }

   it("Disables sign-in button on inital render", async () => {
      const { submitButton } = setup()
      expect(submitButton).toBeDisabled()
   })

   it('Enables sign in button when text is entered', async () => {
      const { usernameInput, passwordInput, submitButton } = setup()
      fireEvent.change(usernameInput, { target: { value: 'username' } })
      fireEvent.change(passwordInput, { target: { value: 'pass' } })
      fireEvent.submit(submitButton);
      await waitFor(() => expect(submitButton).toBeEnabled())
      expect(mockLogin).toBeCalled()
   })

   it("Does not submit when inputs are empty", async () => {
      const { usernameInput, passwordInput, submitButton } = setup()
      fireEvent.change(usernameInput, { target: { value: '' } })
      fireEvent.change(passwordInput, { target: { value: '' } })
      await waitFor(() => fireEvent.submit(submitButton))
      expect(mockLogin).not.toBeCalled()
   })

})