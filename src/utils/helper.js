import { userAccessibleRoutes } from '../constants/keywords';

export const getSidebarMenus = (items, role) => {
  switch (role) {
    case 13:
      return items.filter((item) => userAccessibleRoutes[role].includes(item.id));
    case 29:
      return items.filter((item) => userAccessibleRoutes[role].includes(item.id));
    case 45:
      return items.filter((item) => userAccessibleRoutes[role].includes(item.id));
    default:
      return items;
  }
};
