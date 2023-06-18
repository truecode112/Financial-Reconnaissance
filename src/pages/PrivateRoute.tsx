import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../contexts/Auth.context';

interface Props {
   component: React.JSXElementConstructor<any>,
   exact: boolean,
   path: string[] | string,

}

export default function PrivateRoute({ component: Component, ...rest }: Props) {
   const { authenticatedUser: user } = useAuth()

   return <Route {...rest} render={(props: { location: _Object }) => (
      user?.token ?
         <Component {...{ ...props, ...rest }} />
         :
         <Redirect to={{
            pathname: '/login',
            state: { from: props.location, message: "Unauthorized! You need to be logged in" }
         }} />
   )} />
}