import { Box, Tab, Container, Tabs } from '@mui/material';
import Iconify from '../components/Iconify';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import useTabs from '../hooks/useTabs';
import PersonalAccount from '../components/profile/PersonalAccount';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  // const { enqueueSnackbar } = useSnackbar();
  const { currentTab, onChangeTab } = useTabs('personal');

  const ACCOUNT_TABS = [
    {
      value: 'personal',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <PersonalAccount />,
    },
    {
      value: 'educational',
      icon: <Iconify icon={'eva:book-open-fill'} width={20} height={20} />,
      component: <PersonalAccount />,
    },
    {
      value: 'family',
      icon: <Iconify icon={'eva:people-fill'} width={20} height={20} />,
      component: <PersonalAccount />,
    },
    {
      value: 'social_links',
      icon: <Iconify icon={'eva:linkedin-fill'} width={20} height={20} />,
      component: <PersonalAccount />,
    },
    // {
    //   value: 'change_password',
    //   icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
    //   component: <PersonalAccount />,
    // },
  ];

  return (
    <Container maxWidth={'lg'}>
      <HeaderBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: 'dashboard/app' },
          { name: 'User', href: 'dashboard/app' },
          { name: 'Account Settings' },
        ]}
      />

      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={currentTab}
        onChange={onChangeTab}
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 5 }} />

      {ACCOUNT_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}
