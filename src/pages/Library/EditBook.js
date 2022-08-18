import { Container } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddBookEditForm from '../../components/library/AddBookEditForm';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { getBooksData } from '../../firebase/services';

const EditBook = () => {
  const [bookData, setBookData] = useState(null);
  const params = useParams();
  console.log('params', params);

  useEffect(() => {
    if (params?.bookId) {
      fetchBookData(params.bookId);
    }
  }, [params?.bookId]);

  const fetchBookData = async (bookId) => {
    try {
      const bookData = await getBooksData(bookId);
      if (bookData) setBookData(bookData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page title="Dashboard: Library - Edit Book">
      <Container>
        <HeaderBreadcrumbs
          heading="Library"
          links={[
            { name: 'Dashboard', href: '/dashboard/app' },
            { name: 'Library', href: '/dashboard/library' },
            { name: 'Edit Book', href: `/library/editBook/${params?.bookId}` },
          ]}
        />
        <AddBookEditForm isEdit currentBook={bookData} />
      </Container>
    </Page>
  );
};

export default EditBook;
