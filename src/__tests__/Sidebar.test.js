import { cleanup, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryHistory } from 'history'
import { FiActivity } from "react-icons/fi"
import { QueryClientProvider } from "@tanstack/react-query"
import { Route, Router, Switch } from "react-router-dom"
import MenuIcon from "../components/MenuIcon"
import { AuthProvider } from "../contexts/Auth.context"
import { ToastProvider } from "../contexts/Notification.context"
import { StoreProvider } from "../contexts/Store.context"
import { slugify, queryClientConfig } from "../lib/utils"
import Sidebar from "../pages/Sidebar"

describe("Sidebar", () => {
   afterEach(() => {
      cleanup()
      jest.resetModules()
   })

   const tab = {
      name: 'user management',
      icon: FiActivity,
      children: [
         "transactions",
         "exceptions",
      ]
   }

   const leftClick = { button: 0 }

   function setup() {
      const history = createMemoryHistory()

      const utils = render(
         <Router history={history}>
            <QueryClientProvider client={queryClientConfig}>
               <AuthProvider>
                  <ToastProvider>
                     <StoreProvider>
                        <MenuIcon />
                        <Sidebar tabs={[tab]} />
                        <Switch>
                           {
                              tab.children.map(route =>
                                 <Route exact path={"/" + slugify(route)} key={route}>
                                    <div data-testid={route}>
                                       You hit the {route} page
                                    </div>
                                 </Route>
                              )
                           }
                        </Switch>
                     </StoreProvider>
                  </ToastProvider>
               </AuthProvider>
            </QueryClientProvider>
         </Router>
      )

      const nav = utils.getByLabelText(tab.name)
      const children = tab.children.map(el => utils.getByRole("link", { name: el }))
      const icons = utils.getAllByLabelText(/sidebar-icon/i)
      const toggle = utils.getByLabelText(/sidebar-toggle/i)
      return { nav, children, icons, toggle, utils }
   }

   it("Should render tabs list", () => {
      const { nav, children } = setup()
      expect(nav).toBeInTheDocument()
      children.forEach((el, i) => {
         expect(el).toHaveTextContent(tab.children[i])
         expect(el).toBeInTheDocument()
      })
   })

   it("Should navigate on click", () => {
      const { utils } = setup()
      const leftClick = { button: 0 }

      userEvent.click(utils.getByRole("link", { name: /transactions/i }), leftClick)
      expect(utils.getByText(/you hit the transactions page/i)).toBeInTheDocument()

      userEvent.click(utils.getByRole("link", { name: /exceptions/i }), leftClick)
      expect(utils.getByText(/you hit the exceptions page/i)).toBeInTheDocument()
   })

   it("Should display only icons when collapsed", async () => {
      let { toggle, icons, nav, children, utils } = setup()

      userEvent.click(toggle, leftClick)
      let arr = [nav, ...children]
      arr.forEach(el => expect(el).not.toBeInTheDocument())
      icons.forEach(el => expect(el).toBeInTheDocument())

      userEvent.click(toggle, leftClick)
      nav = utils.getByLabelText(tab.name)
      children = tab.children.map(el => utils.getByRole("link", { name: el }))
      arr = [nav, ...children]
      arr.forEach(el => expect(el).toBeInTheDocument())
   })

   it("Should expand sidebar on any icon click when collapsed", async () => {
      let { toggle, icons, nav, children, utils } = setup()

      userEvent.click(toggle, leftClick) //Collapse sidebar
      let arr = [nav, ...children]
      arr.forEach(el => expect(el).not.toBeInTheDocument())
      icons.forEach(el => expect(el).toBeInTheDocument())

      userEvent.click(icons[0], leftClick) //click any icon
      nav = utils.getByLabelText(tab.name)
      children = tab.children.map(el => utils.getByRole("link", { name: el }))
      arr = [nav, ...children]
      arr.forEach(el => expect(el).toBeInTheDocument())
   })

})