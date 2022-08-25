import { useState, useEffect } from 'react';
// @mui
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
// routes
// hooks
// import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import BlogNewPostForm from './BlogNewPostForm';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { getBlogData } from '../../firebase/services';
// sections

// ----------------------------------------------------------------------

export default function EditBlogPost() {
  // const { themeStretch } = useSettings();

  const [blogData, setBlogData] = useState(null);

  const params = useParams();

  useEffect(() => {
    if (params?.blogId) {
      fetchBlogData(params.blogId);
    }
  }, [params?.blogId]);

  const fetchBlogData = async (blogId) => {
    try {
      const blogData = await getBlogData(blogId);
      // console.log('blogdata..', blogData);

      if (blogData) setBlogData(blogData);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Page title="Blog: New Post">
      {/* themeStretch ? false : 'lg' */}
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Create a new post"
          links={[
            { name: 'Dashboard', href: 'dashboard/app' },
            { name: 'Blog', href: 'dashboard/blog' },
            { name: 'Edit Post', href: `dashboard/blog/EditBlog/${params?.blogId}` },
          ]}
        />

        <BlogNewPostForm isEdit currentBlog={blogData} />
      </Container>
    </Page>
  );
}
