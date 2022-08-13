import { Container } from '@mui/material';
import React from 'react';
import AddBookEditForm from '../../components/library/AddBookEditForm';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';

const AddBook = () => {
  return (
    <Page title="Dashboard: Library - Add Book">
      <Container>
        <HeaderBreadcrumbs
          heading="Library"
          links={[
            { name: 'Dashboard', href: 'dashboard/app' },
            { name: 'Library', href: 'dashboard/library' },
            { name: 'Add Book', href: 'dashboard/library/addBook' },
          ]}
        />
        <AddBookEditForm isEdit={false} currentProduct="" />
      </Container>
    </Page>
  );
};

export default AddBook;
