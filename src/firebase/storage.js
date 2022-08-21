import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';

// -----------------CONSTANTS---------------------------

export const IMAGE_BUCKET = 'images';
export const DOCUMENT_BUCKET = 'documents';
export const PROFILE_PIC_BUCKET = 'profilePicture';

export const uploadFile = async (file, path) =>
  new Promise((resolve) => {
    const fileRef = ref(storage, path);

    uploadBytes(fileRef, file)
      .then(() => {
        // console.log('snapshot', snapshot);
        // console.log('Uploaded a blob or file!');
        getDownloadURL(fileRef)
          .then((url) => resolve(url))
          .catch(() => resolve(false));
      })
      .catch(() => resolve(false));
  });

// DELETE

export const deleteFile = async (filePath) =>
  new Promise((resolve) => {
    const fileRef = ref(storage, filePath);
    deleteObject(fileRef)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
