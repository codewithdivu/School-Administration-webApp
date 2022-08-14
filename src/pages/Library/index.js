import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Container, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/library';
// mock
import PRODUCTS from '../../_mock/products';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserProfileProvider } from '../../contexts/userContext';
import SearchBar from '../../components/SearchBar';

// ----------------------------------------------------------------------

// Products

export default function Library() {
  const [openFilter, setOpenFilter] = useState(false);
  // const { userProfile } = useContext(UserProfileProvider);
  const userProfile = JSON.parse(localStorage.getItem('userProfileData'));
  const navigate = useNavigate();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const navigateAddBook = () => {
    navigate('/dashboard/library/addBook');
  };

  const renderAddBookButton =
    userProfile.role === 29 ? (
      <LoadingButton variant="contained" size="large" onClick={navigateAddBook}>
        Add Books
      </LoadingButton>
    ) : (
      <h1>hello</h1>
    );

  return (
    <Page title="Dashboard: Library">
      <Container>
        <HeaderBreadcrumbs
          heading="Library"
          links={[
            { name: 'Dashboard', href: 'dashboard/app' },
            { name: 'Library', href: 'dashboard/library' },
          ]}
        />
        <SearchBar />
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          {renderAddBookButton}
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} />
      </Container>
    </Page>
  );
}
