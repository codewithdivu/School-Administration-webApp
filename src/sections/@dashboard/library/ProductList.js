import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { getBlob, ref } from 'firebase/storage';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { SectionLoader } from '../../../components/sectionLoader';
import ShopProductCard from './ProductCard';
import PdfViewer from '../../../components/pdf-viewer';
import { deleteDocument } from '../../../firebase/services';
import { BOOKS } from '../../../firebase/collections';
import { storage } from '../../../firebase/config';
import { deleteFile, DOCUMENT_BUCKET, IMAGE_BUCKET } from '../../../firebase/storage';
import SkeletonPostItem from '../../../pages/Blog/SkeletonPostItem';

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
    await getBlob(downloadRef)
      .then((blob) => {
        setBookFile(blob);
        setIsBookViewOpen(true);
      })
      .catch((error) => console.log('error', error));

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

  const handleDeleteBook = async ({ id, uniqueFileName }) => {
    // eslint-disable-next-line no-useless-return
    if (!id) return;
    try {
      const isBookDeleted = await deleteDocument(BOOKS, id);
      console.log('isBookDeleted', isBookDeleted);
      if (isBookDeleted) {
        await deleteFile(`${IMAGE_BUCKET}/${uniqueFileName}`);
        await deleteFile(`${DOCUMENT_BUCKET}/${uniqueFileName}`);
      }
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
      {products &&
        products.length > 0 &&
        products.map((product, index) =>
          product ? (
            <Grid key={product.id} item xs={12} sm={6} md={3}>
              <ShopProductCard
                handleViewBook={handleViewBook}
                handleDeleteBook={handleDeleteBook}
                handleEditBook={handleEditBook}
                product={product}
              />
            </Grid>
          ) : (
            <SkeletonPostItem key={index} />
          )
        )}
      {isBookViewOpen && (
        <PdfViewer file={bookFile} filename="divu" onClose={handleCloseBookView} open={isBookViewOpen} />
      )}
    </Grid>
  );
}
