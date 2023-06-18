// import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { Link, Route, Switch, useLocation } from 'react-router-dom'

const About = () => <div>You are on the about page</div>
const Home = () => <div>You are home</div>
const NoMatch = () => <div>No match</div>

export const LocationDisplay = () => {
    const location = useLocation()
    return <div data-testid="location-display">{location.pathname}</div>
}

const setup = () => {
    const history = createMemoryHistory()

    const utils = render(
        <Router history={history}>
            <Link to="/">Home</Link>

            <Link to="/about">About</Link>

            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>

                <Route path="/about">
                    <About />
                </Route>

                <Route>
                    <NoMatch />
                </Route>
            </Switch>

            <LocationDisplay />
        </Router>
    )

    return { history, utils }
}

test('full app rendering/navigating', () => {
    const { utils } = setup()
    // verify page content for expected route
    // often you'd use a data-testid or role query, but this is also possible
    expect(utils.getByText(/you are home/i)).toBeInTheDocument()

    userEvent.click(utils.getByText(/about/i), { button: 0 })

    // check that the content changed to the new page
    expect(screen.getByText(/you are on the about page/i)).toBeInTheDocument()
})

test('landing on a bad page', () => {
    const { history } = setup()
    history.push('/some/bad/route')

    expect(screen.getByText(/no match/i)).toBeInTheDocument()
})

test('rendering a component that uses useLocation', () => {
    const { history, utils } = setup()
    const route = '/some-route'
    history.push(route)

    expect(utils.getByTestId('location-display')).toHaveTextContent(route)
})