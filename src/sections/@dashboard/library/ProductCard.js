import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { LoadingButton } from '@mui/lab';
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
// import { ColorPreview } from '../../../components/color-utils';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  handleViewBook: PropTypes.func,
  handleDeleteBook: PropTypes.func,
};

export default function ShopProductCard({ product, handleViewBook, handleDeleteBook, handleEditBook }) {
  const userProfile = JSON.parse(localStorage.getItem('userProfileData'));

  const renderDeleteBookButton = userProfile?.role === 29 && (
    <LoadingButton variant="contained" size="small" onClick={() => handleDeleteBook(product.id)}>
      Delete
    </LoadingButton>
  );

  const renderEditBookLabel = userProfile?.role === 29 && (
    <LoadingButton variant="contained" size="small" onClick={() => handleEditBook(product.id)}>
      Edit
    </LoadingButton>
    // <Label
    //   variant="filled"
    //   sx={{
    //     zIndex: 9,
    //     top: 16,
    //     right: 16,
    //     position: 'absolute',
    //   }}
    // >
    //   Edit
    // </Label>
  );

  const { name, price, imageUrl } = product;
  return (
    // onClick={() => handleViewBook(product)}
    <Card style={{ cursor: 'pointer' }}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* {renderEditBookLabel} */}
        <ProductImgStyle alt={name} src={imageUrl} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={code} /> */}
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {price && fCurrency(price)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
          {renderEditBookLabel}
          {renderDeleteBookButton}
        </Stack>
      </Stack>
    </Card>
  );
}
