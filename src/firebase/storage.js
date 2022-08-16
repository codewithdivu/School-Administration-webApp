import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';

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

// export const deleteFile = async ()
