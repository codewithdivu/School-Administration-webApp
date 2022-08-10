import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import useAuthenticateUser from './hooks/useAuthenticateUser';
import Loader from './components/Loader';
import AccountGeneral from './pages/account';
import Profile from './pages/profile';
import Register from './pages/Register';

// ----------------------------------------------------------------------

export default function Router() {
  const { user, isLoader } = useAuthenticateUser();

  // console.log('user', user);
  // console.log('isLoader', isLoader);

  if (isLoader) {
    return <Loader isLoading={isLoader} />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRoutes([
    {
      path: '/dashboard',
      element: user ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'library', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'account', element: <AccountGeneral />},
        { path: 'profile', element: <Profile />}
      ],
    },
    {
      path: '/',
      element: !user ? <LogoOnlyLayout /> : <Navigate to="/dashboard/app" />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
