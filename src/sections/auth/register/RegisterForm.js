import * as Yup from 'yup';
import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { roles } from '../../../constants/metadata';
import { auth } from '../../../firebase/config';
import { addUser, updateAuth } from '../../../firebase/services';
import config from '../../../config';
import { appRoutes } from '../../../constants/appRoutes';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
  });

  // methods

  const handleRegister = async (userRegisteredData) => {
    // console.log('registered data', userRegisteredData);
    const { email, password, fullName, role } = userRegisteredData;
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const { user } = userCredential;
        // console.log('user', user);
        if (user) {
          const isAuthUpdated = await updateAuth({ displayName: fullName, email });
          if (isAuthUpdated) {
            await addUser({ ...user?.providerData[0], displayName: fullName, email, role });
            if (user.emailVerified === false) {
              sendEmailVerification(auth.currentUser, { url: config.BASE_URL })
                .then(() => {
                  // eslint-disable-next-line no-alert
                  alert('we have sent you a verification link in your mail please...kindly verify it');
                  navigate(appRoutes.LOGIN, { replace: true });
                })
                .catch(() => {});
            }
          }
        }
      })
      .catch(() => {
        // console.log('error', error);
      });
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      role: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: handleRegister,
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Full name"
            {...getFieldProps('fullName')}
            error={Boolean(touched.fullName && errors.fullName)}
            helperText={touched.fullName && errors.fullName}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              placeholder="Role"
              label="Role"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              {...getFieldProps('role')}
              error={Boolean(touched.role && errors.role)}
              helperText={touched.role && errors.role}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} selected value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
