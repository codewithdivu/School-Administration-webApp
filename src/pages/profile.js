import { capitalCase } from 'change-case';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
// routes
// hooks
import useAuthenticateUser from '../hooks/useAuthenticateUser';
import useTabs from '../hooks/useTabs';
// _mock_
// import { _userAbout, _userFeeds } from '../_mock/_user';
// components
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// sections
import { ProfileCover, ProfileSocialInfo } from '../components/profile';
import Iconify from '../components/Iconify';

import useUserProfile from '../hooks/useUserProfile';
import Loader from '../components/Loader';
// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function UserProfile() {
  const { user } = useAuthenticateUser();

  const { userProfileData, isProfileLoading } = useUserProfile(user.email);

  const { currentTab, onChangeTab } = useTabs('personal');

  if (isProfileLoading) {
    return <Loader isLoading={isProfileLoading} />;
  }

  const PROFILE_TABS = [
    {
      value: 'personal',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      // component: <Profile myProfile={_userAbout} posts={_userFeeds} />,
    },
    {
      value: 'educational',
      icon: <Iconify icon={'eva:book-open-fill'} width={20} height={20} />,
      // component: <ProfileAbout followers={_userFollowers} />,
    },
    {
      value: 'family',
      icon: <Iconify icon={'eva:people-fill'} width={20} height={20} />,
      //   component: <ProfileFriends friends={_userFriends} findFriends={findFriends} onFindFriends={handleFindFriends} />,
    },
    {
      value: 'socialMedia',
      icon: <Iconify icon={'eva:linkedin-fill'} width={20} height={20} />,
      component: <ProfileSocialInfo socialProfile={userProfileData} />,
    },
  ];

  return (
    <Container maxWidth={'lg'}>
      <HeaderBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: 'dashboard/app' },
          { name: 'User', href: 'dashboard/app' },
          { name: user?.displayName || '' },
        ]}
      />
      <Card
        sx={{
          mb: 3,
          height: 280,
          position: 'relative',
        }}
      >
        <ProfileCover myProfile="" />

        <TabsWrapperStyle>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab}
            onChange={onChangeTab}
          >
            {PROFILE_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
            ))}
          </Tabs>
        </TabsWrapperStyle>
      </Card>

      {PROFILE_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}
