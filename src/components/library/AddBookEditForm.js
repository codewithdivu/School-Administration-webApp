import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, InputAdornment } from '@mui/material';
// routes
// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadMultiFile } from '../hook-form';
import { addBook, updateItem } from '../../firebase/services';
import { uploadFile } from '../../firebase/storage';
import { BOOKS } from '../../firebase/collections';

// ----------------------------------------------------------------------

const CATEGORY_OPTION = [
  { group: 'Standard', classify: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { group: 'Others', classify: ['History', 'Novels', 'Stories', 'GK'] },
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

AddBookEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBook: PropTypes.object,
};

export default function AddBookEditForm({ isEdit, currentBook }) {
  const navigate = useNavigate();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array(),
    bookFile: Yup.array(),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    category: Yup.string().required('Category is required'),
    code: Yup.number().required('Book Code is required'),
  });
  // .min(1, 'Images is required')

  const defaultValues = useMemo(
    () => ({
      name: currentBook?.name || '',
      description: currentBook?.description || '',
      images: currentBook?.images || [],
      bookFile: currentBook?.bookFile || [],
      code: currentBook?.code || '',
      price: currentBook?.price || 0,
      category: currentBook?.category || CATEGORY_OPTION[0].classify[1],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBook]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,

    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentBook) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBook]);

  const onSubmit = async ({ images, bookFile, ...bookData }) => {
    // console.log('bookData', bookData);
    try {
      const bookUrl = await uploadFile(bookFile[0], `documents/${bookFile[0]?.name}`);
      const imageUrl = await uploadFile(images[0], `images/${images[0]?.name}`);
      // console.log('bookUrl', bookUrl);
      // console.log('imagesUrl', imageUrl);
      if (isEdit) {
        await updateItem(BOOKS, currentBook.id, bookData);
      } else await addBook({ ...bookData, bookUrl, imageUrl });

      navigate('/dashboard/library');
    } catch (error) {
      console.log('there is error', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };
  const handleDropBookFile = useCallback(
    (acceptedFiles) => {
      setValue(
        'bookFile',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAllBookFile = () => {
    setValue('bookFile', []);
  };

  const handleRemoveBookFile = (file) => {
    const filteredItems = values.bookFile?.filter((_file) => _file !== file);
    setValue('bookFile', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Book Name" />
              <RHFTextField name="description" label="Book Description" multiline maxRows={6} />

              <div>
                <LabelStyle>Book Images</LabelStyle>
                <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
              <div>
                <LabelStyle>Book</LabelStyle>
                <RHFUploadMultiFile
                  name="bookFile"
                  showPreview
                  accept="application/pdf"
                  maxSize={3145728}
                  onDrop={handleDropBookFile}
                  onRemove={handleRemoveBookFile}
                  onRemoveAll={handleRemoveAllBookFile}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFTextField name="code" label="Book Code" />

                <RHFSelect name="category" label="Category">
                  {CATEGORY_OPTION.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Add Book' : 'Update Book'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
