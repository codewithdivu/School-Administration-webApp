import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileSocialInfo.propTypes = {
  socialProfile: PropTypes.object,
};

export default function ProfileSocialInfo({ socialProfile = {} }) {
  const { facebook, instagram, linkedIn, twitter } = socialProfile;
  // console.log('socialProfile', socialProfile);
  const SOCIALS = [
    {
      name: 'Linkedin',
      icon: <IconStyle icon={'eva:linkedin-fill'} color="#006097" />,
      href: linkedIn,
    },
    {
      name: 'Twitter',
      icon: <IconStyle icon={'eva:twitter-fill'} color="#1C9CEA" />,
      href: twitter,
    },
    {
      name: 'Instagram',
      icon: <IconStyle icon={'ant-design:instagram-filled'} color="#D7336D" />,
      href: instagram,
    },
    {
      name: 'Facebook',
      icon: <IconStyle icon={'eva:facebook-fill'} color="#1877F2" />,
      href: facebook,
    },
  ];

  return (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {SOCIALS.map((link) => (
          <Stack key={link.name} direction="row" alignItems="center">
            {link.icon}
            <Link
              component={RouterLink}
              to={{ pathName: link.href ?? '#' }}
              target={'_blank'}
              variant="body2"
              color="text.primary"
              noWrap
            >
              {link.href}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
