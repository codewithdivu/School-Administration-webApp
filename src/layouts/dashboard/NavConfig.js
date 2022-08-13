// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    id: 11,
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    id: 12,
    title: 'profile',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-fill'),
  },
  {
    id: 13,
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    id: 14,
    title: 'library',
    path: '/dashboard/library',
    icon: getIcon('eva:book-fill'),
  },
  {
    id: 15,
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
];

export default navConfig;
