import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import { SectionLoader } from '../../../components/sectionLoader';
import PdfViewer from '../../../components/pdf-viewer';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default function ProductList({ products, isLoading, ...other }) {
  const [isBookViewOpen, setIsBookViewOpen] = useState(false);
  const [bookFile, setBookFile] = useState(null);

  const handleViewBook = async (book) => {
    if (!book?.bookUrl) return;
    await fetch(book?.bookUrl, { headers: new Headers({ 'Access-Control-Allow-Origin': '*' }) }).then((response) => {
      response.blob().then((blob) => {
        setBookFile(blob);
        setIsBookViewOpen(true);
      });
    });
  };
  const handleCloseBookView = () => {
    setIsBookViewOpen(false);
    setBookFile(null);
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
            <ShopProductCard handleViewBook={handleViewBook} product={product} />
          </Grid>
        ))
      )}
      {isBookViewOpen && (
        <PdfViewer file={bookFile} filename="divu" onClose={handleCloseBookView} open={isBookViewOpen} />
      )}
    </Grid>
  );
}
