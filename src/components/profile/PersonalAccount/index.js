import * as Yup from 'yup';
import { useCallback, useContext, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
// import useAuth from '../../../../hooks/useAuth';
// utils
// import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../_mock/_countries';
// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../hook-form';
import useAuthenticateUser from '../../../hooks/useAuthenticateUser';
import { updateAuth, updateUser } from '../../../firebase/services';
import useUserProfile from '../../../hooks/useUserProfile';
import Loader from '../../Loader';
import { UserProfileContext } from '../../../contexts/userContext';

const PersonalAccount = () => {
  const { user } = useAuthenticateUser();
  const { userProfile, setUserProfile } = useContext(UserProfileContext);
  const { userProfileData, isProfileLoading } = useUserProfile(user?.email);

  const [isUserAdding, setIsUserAdding] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
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
    if (userProfile) {
      setValue('photoURL', userProfile.photoURL);
      setValue('email', userProfile.email);
      setValue('displayName', userProfile.displayName);
      setValue('phoneNumber', userProfile.phoneNumber);
      setValue('country', userProfile.country);
      setValue('address', userProfile.address);
      setValue('state', userProfile.state);
      setValue('city', userProfile.city);
      setValue('zipCode', userProfile.zipCode);
      setValue('about', userProfile.about);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const onSubmit = async (formData) => {
    setIsUserAdding(true);
    const authUpdateData = {};
    // eslint-disable-next-line no-unused-vars
    const { email, isPublic, ...rest } = formData;
    if (userProfile.displayName !== formData.displayName) {
      authUpdateData.displayName = formData.displayName;
    }
    if (userProfile.phoneNumber !== formData.phoneNumber) {
      authUpdateData.phoneNumber = formData.phoneNumber;
    }

    if (Object.keys(authUpdateData).length > 0) {
      await updateAuth(authUpdateData);
    }

    try {
      const isDataUpdated = await updateUser({ ...rest, id: userProfile.id });
      console.log('isUpdated', isDataUpdated);
      setUserProfile(userProfileData);
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
              <RHFTextField name="address" label="Address" />
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
