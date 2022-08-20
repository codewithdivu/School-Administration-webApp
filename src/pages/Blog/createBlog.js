// @mui
import { Container } from '@mui/material';
// routes
// hooks
// import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import BlogNewPostForm from './BlogNewPostForm';
// sections

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  // const { themeStretch } = useSettings();

  return (
    <Page title="Blog: New Post">
      {/* themeStretch ? false : 'lg' */}
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Create a new post"
          links={[
            { name: 'Dashboard', href: 'dashboard/app' },
            { name: 'Blog', href: 'dashboard/blog' },
            { name: 'New Post', href: 'dashboard/blog/newPost' },
          ]}
        />

        <BlogNewPostForm />
      </Container>
    </Page>
  );
}
