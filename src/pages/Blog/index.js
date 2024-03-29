import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';
// mock
// import POSTS from '../../_mock/blog';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useListener from '../../hooks/useListner';
import { BLOGS } from '../../firebase/collections';
import SkeletonPostItem from './SkeletonPostItem';
import { appRoutes } from '../../constants/appRoutes';
import { deleteDocument } from '../../firebase/services';
import { deleteFile, IMAGE_BUCKET } from '../../firebase/storage';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function Blog() {
  const { listenerData, isLoading } = useListener(BLOGS);
  const userProfile = JSON.parse(localStorage.getItem('userProfileData'));

  const navigate = useNavigate();

  const handleEditBlog = (blogId) => {
    console.log('blogId', blogId);
    navigate(`/dashboard/blog/EditBlog/${blogId}`);
  };

  const handleDeleteBlog = async ({ id, uniqueFileName }) => {
    console.log('deleted...', id);
    try {
      const isBlogDeleted = await deleteDocument(BLOGS, id);
      if (isBlogDeleted) {
        await deleteFile(`${IMAGE_BUCKET}/${uniqueFileName}`);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Page title="Blog">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <HeaderBreadcrumbs
            heading="Blog"
            links={[
              { name: 'Dashboard', href: 'dashboard/app' },
              { name: 'Blogs', href: 'dashboard/blog' },
            ]}
          />
          {userProfile?.role === 45 && (
            <Button
              variant="contained"
              to={appRoutes.DASHBOARD_BLOG_NEW_BLOG}
              component={RouterLink}
              startIcon={<Iconify color="white" icon="eva:plus-fill" />}
            >
              New Post
            </Button>
          )}
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={listenerData} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {(!listenerData?.length ? [...Array(12)] : listenerData).map((post, index) =>
            post ? (
              // <Grid key={post.id} item xs={12} sm={6} md={6}>
              <BlogPostCard
                post={post}
                index={index}
                handleEditBlog={handleEditBlog}
                handleDeleteBlog={handleDeleteBlog}
              />
            ) : (
              // </Grid>
              <SkeletonPostItem key={index} />
            )
          )}
          {/* {listenerData &&
            listenerData.length > 0 &&
            listenerData?.map((post, index) => <BlogPostCard key={post.id} post={post} index={index} />)} */}
        </Grid>
      </Container>
    </Page>
  );
}
