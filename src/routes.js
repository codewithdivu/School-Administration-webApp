import { Navigate, useRoutes } from 'react-router-dom';
import { useContext } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Library from './pages/Library';
import DashboardApp from './pages/DashboardApp';
import useAuthenticateUser from './hooks/useAuthenticateUser';
import Loader from './components/Loader';
import AccountGeneral from './pages/account';
import Profile from './pages/profile';
import Register from './pages/Register';
import { UserProfileContext } from './contexts/userContext';
import useUserProfile from './hooks/useUserProfile';
import AddBook from './pages/Library/AddBook';
import EditBook from './pages/Library/EditBook';
import BlogNewPost from './pages/Blog/createBlog';
import { appRoutes } from './constants/appRoutes';

// ----------------------------------------------------------------------

export default function Router() {
  const { user, isLoader } = useAuthenticateUser();

  const { userProfile } = useContext(UserProfileContext);
  const { isProfileLoading } = useUserProfile(user?.email);

  // console.log('user', user);
  // console.log('isLoader', isLoader);

  if (isLoader || isProfileLoading) {
    return <Loader isLoading={isLoader || isProfileLoading} />;
  }

  const notFoundRoute = { path: appRoutes.UNIVERSAL, element: <Navigate to={appRoutes.NOT_FOUND} replace /> };

  const publicRoutes = [
    {
      path: '/',
      element: !user ? <LogoOnlyLayout /> : <Navigate to={appRoutes.DASHBOARD_APP} />,
      children: [
        { path: '/', element: <Navigate to={appRoutes.DASHBOARD_APP} /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to={appRoutes.NOT_FOUND} /> },
      ],
    },
    notFoundRoute,
  ];

  const studentRoutes = [
    {
      path: appRoutes.DASHBOARD,
      element: user ? <DashboardLayout /> : <Navigate to={appRoutes.LOGIN} />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'library', element: <Library /> },
        { path: 'blog', element: <Blog /> },
        { path: 'account', element: <AccountGeneral /> },
        { path: 'profile', element: <Profile /> },
        notFoundRoute,
      ],
    },
    ...publicRoutes,
  ];
  const teacherRoutes = [
    {
      path: appRoutes.DASHBOARD,
      element: user ? <DashboardLayout /> : <Navigate to={appRoutes.LOGIN} />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'library', element: <Library /> },
        { path: 'blog', element: <Blog /> },
        { path: 'blog/newBlog', element: <BlogNewPost /> },
        { path: 'account', element: <AccountGeneral /> },
        { path: 'profile', element: <Profile /> },
        notFoundRoute,
      ],
    },
    ...publicRoutes,
  ];
  const librarianRoutes = [
    {
      path: appRoutes.DASHBOARD,
      element: user ? <DashboardLayout /> : <Navigate to={appRoutes.LOGIN} />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        // { path: 'user', element: <User /> },
        { path: 'library', element: <Library /> },
        { path: 'library/addBook', element: <AddBook /> },
        { path: 'library/editBook/:bookId', element: <EditBook /> },
        // { path: 'blog', element: <Blog /> },
        { path: 'account', element: <AccountGeneral /> },
        { path: 'profile', element: <Profile /> },
        notFoundRoute,
      ],
    },
    ...publicRoutes,
  ];

  const getRoutes = (routes) => {
    switch (routes) {
      case 13:
        return studentRoutes;
      case 29:
        return librarianRoutes;
      case 45:
        return teacherRoutes;
      default:
        return studentRoutes;
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const finalRoutes = getRoutes(userProfile?.role);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRoutes(finalRoutes);
}
