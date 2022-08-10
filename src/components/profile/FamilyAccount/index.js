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
import { regex } from '../../../constants/keywords';

const EducationalAccount = () => {
  const { user } = useAuthenticateUser();
  const { userProfileData, isProfileLoading } = useUserProfile(user?.email);

  const [isUserAdding, setIsUserAdding] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    surname: Yup.string().required('Surname is required'),
    father: Yup.string().required('Father name is required'),
    mother: Yup.string().required('Mother name is required'),
    members: Yup.number().required('Members is required'),
    parentsPhoneNumber: Yup.string()
      .required('phone no is required')
      .matches(regex.phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),
    alternatePhoneNumber: Yup.string()
      .matches(regex.phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),
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
      setValue('surname', userProfileData.surname);
      setValue('father', userProfileData.father);
      setValue('mother', userProfileData.mother);
      setValue('members', userProfileData.members);
      setValue('parentsPhoneNumber', userProfileData.parentsPhoneNumber);
      setValue('alternatePhoneNumber', userProfileData.alternatePhoneNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  const onSubmit = async (formData) => {
    // console.log('FamilyFormData', formData);

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
      const isDataUpdated = await updateUser({ ...formData, id: userProfileData.id });
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
              {/* <RHFSelect name="standard" label="Standard" placeholder="Standard">
                <option value="" />
                {standard.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect> */}
              <RHFTextField name="surname" label="Surname" />
              <RHFTextField name="father" label="Father Name" />
              <RHFTextField name="mother" label="Mother Name" />
              <RHFTextField name="members" label=" How many Family Members?" />
              <RHFTextField name="parentsPhoneNumber" label="Parents Phone Number" />
              <RHFTextField name="alternatePhoneNumber" label="alternate Phone Number" />
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

export default EducationalAccount;
