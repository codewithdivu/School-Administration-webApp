import { sendEmailVerification, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useContext } from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';
import AuthSocial from '../sections/auth/AuthSocial';

import { auth, provider } from '../firebase/config';
import { addUser, getUserData } from '../firebase/services';
import { UserProfileContext } from '../contexts/userContext';
import config from '../config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ---------------------SIGN IN WITH GOOGLE -----------------------------------------

// ----------------------------------------------------------------------

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        const { user } = result;
        if (user.email) {
          const response = await getUserData(user.email);

          if (!response) {
            await addUser({ ...user?.providerData[0] });
          }
          navigate('/dashboard/app');
        }
      })
      .catch(() => {});
  };

  const handleEmailSignIn = async (loginData) => {
    const { email, password } = loginData;
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { user } = userCredential;

        if (user.emailVerified) {
          navigate('/dashboard/app', { replace: true });
        } else {
          sendEmailVerification(auth.currentUser, { url: config.BASE_URL })
            .then(() => {
              // eslint-disable-next-line no-alert
              alert('we have sent you a verification link in your mail please...kindly verify it');
            })
            .catch(() => {});
        }
        // ...
      })
      .catch(() => {});
  };

  const handleSignIn = (value, loginData = '') => {
    // console.log('value', value)
    // e.preventDefault();
    switch (value) {
      case 'google':
        handleGoogleSignIn();
        break;
      case 'email':
        handleEmailSignIn(loginData);
        break;

      default:
        break;
    }
  };

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />

          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/static/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign in
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Log in using below.</Typography>

            <AuthSocial signIn={handleSignIn} />

            <LoginForm signIn={handleSignIn} />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
