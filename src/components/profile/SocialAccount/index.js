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
// components
import { FormProvider, RHFTextField } from '../../hook-form';
import useAuthenticateUser from '../../../hooks/useAuthenticateUser';
import { updateAuth, updateUser } from '../../../firebase/services';
import useUserProfile from '../../../hooks/useUserProfile';
import Loader from '../../Loader';

const SocialAccount = () => {
  const { user } = useAuthenticateUser();
  const { userProfileData, isProfileLoading } = useUserProfile(user?.email);

  const [isUserAdding, setIsUserAdding] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    facebook: Yup.string().url(),
    twitter: Yup.string().url(),
    linkedIn: Yup.string().url(),
    instagram: Yup.string().url(),
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
      setValue('facebook', userProfileData.facebook);
      setValue('twitter', userProfileData.twitter);
      setValue('linkedIn', userProfileData.linkedIn);
      setValue('instagram', userProfileData.instagram);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  const onSubmit = async (formData) => {
    // console.log('SocialFormData', formData);

    setIsUserAdding(true);
    // const authUpdateData = {};
    // // eslint-disable-next-line no-unused-vars
    // const { email, isPublic, ...rest } = formData;
    // if (userProfileData.displayName !== formData.displayName) {
    //   authUpdateData.displayName = formData.displayName;
    // }
    // if (userProfileData.phoneNumber !== formData.phoneNumber) {
    //   authUpdateData.phoneNumber = formData.phoneNumber;
    // }

    // if (Object.keys(authUpdateData).length > 0) {
    //   await updateAuth(authUpdateData);
    // }

    try {
      await updateUser({ ...formData, id: userProfileData.id });
      setIsUserAdding(false);
    } catch (error) {
      console.error(error);
      setIsUserAdding(false);
    }
  };

  if (isProfileLoading) {
    return <Loader isLoading={isProfileLoading} />;
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
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
        </Grid> */}

        <Grid item xs={12} md={8}>
          {/* <h2> please put your Social Profile Links</h2> */}
          <Card sx={{ p: 3, rowGap: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {/* <RHFSelect name="standard" label="Standard" placeholder="Standard">
                <option value="" />
                {standard.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect> */}
              <RHFTextField name="facebook" label="Facebook Profile Link" />
              <RHFTextField name="twitter" label="Twitter Profile Link" />
              <RHFTextField name="linkedIn" label="LinkedIn Profile Link" />
              <RHFTextField name="instagram" label="Instagram Profile Link" />
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}
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

export default SocialAccount;
