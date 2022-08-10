import * as Yup from 'yup';
import {  useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
// import useAuth from '../../../../hooks/useAuth';
// utils
// import { fData } from '../../../../utils/formatNumber';
// _mock
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../hook-form';
import useAuthenticateUser from '../../../hooks/useAuthenticateUser';
import {  updateUser } from '../../../firebase/services';
import useUserProfile from '../../../hooks/useUserProfile';
import Loader from '../../Loader';

const FamilyAccount = () => {
  const { user } = useAuthenticateUser();
  const { userProfileData, isProfileLoading } = useUserProfile(user?.email);

  const [isUserAdding, setIsUserAdding] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    standard: Yup.string().required('Standard is required'),
    rollNo: Yup.number()
      .min(100000, 'Must be exactly 6 characters')
      .max(999999, 'Must be exactly 6 characters')
      .required('Roll no is required'),
    division: Yup.string()
      .required('Division is required')
      .min(2, 'Must be exact 2 characters')
      .max(2, 'Must be exact 2 characters'),
    aadharNumber: Yup.number()
      .min(100000000000, 'Must be exactly 12 characters')
      .max(999999999999, 'Must be exactly 12 characters')
      .required('Aadhar number is required'),
    religion: Yup.string().required('Religion is required'),
    birthPlace: Yup.string().required('Birth Place is required'),
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
      setValue('standard', userProfileData.standard);
      setValue('rollNo', userProfileData.rollNo);
      setValue('division', userProfileData.division);
      setValue('aadharNumber', userProfileData.aadharNumber);
      setValue('religion', userProfileData.religion);
      setValue('birthPlace', userProfileData.birthPlace);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  const onSubmit = async (formData) => {
    // console.log('EducationalFormData', formData);

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
    //   // await updateAuth(authUpdateData);
    // }

    try {
      await updateUser({ ...formData, id: userProfileData.id });
      setIsUserAdding(false);
    } catch (error) {
      console.error(error);
      setIsUserAdding(false);
    }
  };

  const standard = Array.from({ length: 12 }, (_, i) => i + 1);

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
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFSelect name="standard" label="Standard" placeholder="Standard">
                <option value="" />
                {standard.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="rollNo" label="Roll number" />
              <RHFTextField name="division" label="Division" />
              <RHFTextField name="aadharNumber" label="Aadhar Number" />
              <RHFTextField name="religion" label="Religion" />

              <RHFTextField name="birthPlace" label="Place of Birth" />
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

export default FamilyAccount;
