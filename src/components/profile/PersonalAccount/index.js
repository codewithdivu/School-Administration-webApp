import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { countries } from '../../../_mock/_countries';
// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar, RHFDatePicker } from '../../hook-form';
import useAuthenticateUser from '../../../hooks/useAuthenticateUser';
import { updateAuth, updateUser } from '../../../firebase/services';
import useUserProfile from '../../../hooks/useUserProfile';
import Loader from '../../Loader';
import { genderItems } from '../../../constants/metadata';
import { regex } from '../../../constants/keywords';

// ................................................................................................................................

const PersonalAccount = () => {
  // HOOKS

  const { user } = useAuthenticateUser();
  const { userProfileData, isProfileLoading } = useUserProfile(user?.email);

  const [isUserAdding, setIsUserAdding] = useState(false);

  // CONSTANTS

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string().email(),
    phoneNumber: Yup.string()
      .required('required')
      .matches(regex.phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),
    birthDate: Yup.date().required('Birth Date is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.string().required('Gender is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.number()
      .min(100000, 'Must be exactly 6 characters')
      .max(999999, 'Must be exactly 6 characters')
      .required('ZipCode is required'),
    about: Yup.string().required('About is required'),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (userProfileData) {
      setValue('photoURL', userProfileData.photoURL);
      setValue('email', userProfileData.email);
      setValue('displayName', userProfileData.displayName);
      setValue('phoneNumber', userProfileData.phoneNumber);
      setValue('country', userProfileData.country);
      setValue('address', userProfileData.address);
      setValue('state', userProfileData.state);
      setValue('city', userProfileData.city);
      setValue('zipCode', userProfileData.zipCode);
      setValue('about', userProfileData.about);
      setValue('gender', userProfileData.gender);
      setValue('birthDate', userProfileData.birthDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  // METHODS

  const onSubmit = async (formData) => {
    // console.log('formData', formData);

    setIsUserAdding(true);
    const authUpdateData = {};
    // eslint-disable-next-line no-unused-vars
    const { email, isPublic, ...rest } = formData;
    if (userProfileData.displayName !== formData.displayName) {
      authUpdateData.displayName = formData.displayName;
    }
    if (userProfileData.phoneNumber !== formData.phoneNumber) {
      authUpdateData.phoneNumber = formData.phoneNumber;
    }

    if (Object.keys(authUpdateData).length > 0) {
      await updateAuth(authUpdateData);
    }

    try {
      const isDataUpdated = await updateUser({ ...rest, id: userProfileData.id });
      // console.log('isUpdated', isDataUpdated);
      setIsUserAdding(false);
    } catch (error) {
      console.error(error);
      setIsUserAdding(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  if (isProfileLoading) {
    return <Loader isLoading={isProfileLoading} />;
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of 3MB
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="displayName" label="Name" />
              <RHFTextField disabled name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFDatePicker name="birthDate" label="Birth Date" />
              <RHFTextField name="address" label="Address" />
              <RHFSelect name="gender" label="Gender">
                {genderItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipCode" label="Zip/Code" />
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />
              <LoadingButton type="submit" variant="contained" loading={isSubmitting || isUserAdding}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default PersonalAccount;
