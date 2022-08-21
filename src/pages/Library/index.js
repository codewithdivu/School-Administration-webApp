import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Container, Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../../components/Page';
import { ProductSort, ProductList, ProductFilterSidebar } from '../../sections/@dashboard/library';
// mock
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import SearchBar from '../../components/SearchBar';
import useListener from '../../hooks/useListner';
import { BOOKS } from '../../firebase/collections';
import { appRoutes } from '../../constants/appRoutes';

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
    navigate(appRoutes.DASHBOARD_LIBRARY_ADD_BOOK);
  };

  const renderAddBookButton = userProfile?.role === 29 && (
    <LoadingButton variant="contained" size="large" onClick={navigateAddBook}>
      Add Book
    </LoadingButton>
  );

  const { listenerData, isLoading } = useListener(BOOKS);
  // console.log('allBooksData', listenerData);

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
        <Grid container>
          <Grid item>
            <SearchBar />
          </Grid>
          <Grid item xs>
            <Grid container direction="row-reverse">
              <Grid item>{renderAddBookButton}</Grid>
            </Grid>
          </Grid>
        </Grid>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList isLoading={isLoading} products={listenerData} />
      </Container>
    </Page>
  );
}
