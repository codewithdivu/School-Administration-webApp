import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { getBlob, ref } from 'firebase/storage';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SectionLoader } from '../../../components/sectionLoader';
import ShopProductCard from './ProductCard';
import PdfViewer from '../../../components/pdf-viewer';
import { deleteBook } from '../../../firebase/services';
import { BOOKS } from '../../../firebase/collections';
import { storage } from '../../../firebase/config';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default function ProductList({ products, isLoading, ...other }) {
  const navigate = useNavigate();

  const [isBookViewOpen, setIsBookViewOpen] = useState(false);
  const [bookFile, setBookFile] = useState(null);

  const handleViewBook = async (book) => {
    console.log('book', book);
    if (!book?.bookUrl) return;
    const downloadRef = ref(storage, `documents/${book.uniqueFileName}`);
    await getBlob(downloadRef).then((blob) => console.log(blob));
    // await axios
    //   .get(book?.bookUrl, {
    //     headers: { 'Access-Control-Allow-Origin': '*' },
    //   })
    //   .then((response) => {
    //     response.blob().then((blob) => {
    //       setBookFile(blob);
    //       setIsBookViewOpen(true);
    //     });
    //   })
    //   .catch((error) => console.log(error));
  };
  const handleCloseBookView = () => {
    setIsBookViewOpen(false);
    setBookFile(null);
  };

  const handleDeleteBook = async (bookId) => {
    // eslint-disable-next-line no-useless-return
    if (!bookId) return;
    try {
      const isBookDeleted = await deleteBook(BOOKS, bookId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditBook = (bookId) => {
    // console.log('edited....', bookId);
    navigate(`/dashboard/library/editBook/${bookId}`);
  };

  return (
    <Grid container spacing={3} {...other}>
      {isLoading ? (
        <SectionLoader />
      ) : (
        products &&
        products.length > 0 &&
        products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={3}>
            <ShopProductCard
              handleViewBook={handleViewBook}
              handleDeleteBook={handleDeleteBook}
              handleEditBook={handleEditBook}
              product={product}
            />
          </Grid>
        ))
      )}
      {isBookViewOpen && (
        <PdfViewer file={bookFile} filename="divu" onClose={handleCloseBookView} open={isBookViewOpen} />
      )}
    </Grid>
  );
}
