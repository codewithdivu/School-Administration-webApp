import PropTypes from 'prop-types';
// material
import { Stack, Button, Divider, Typography } from '@mui/material';
// component
import Iconify from '../../components/Iconify';
import { socialSignInButtonsItems } from '../../constants/metadata';

// ----------------------------------------------------------------------

export default function AuthSocial({ signIn }) {
  return (
    <>
      <Stack direction="row" spacing={2}>
        {socialSignInButtonsItems.map((item) => (
          <Button
            key={item.id}
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={(e) => signIn(e, item.value)}
          >
            <Iconify icon={`eva:${item.value}-fill`} color={item.color} width={22} height={22} />
          </Button>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}

AuthSocial.propTypes = {
  signIn: PropTypes.func,
};
