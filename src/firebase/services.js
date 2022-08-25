import { collection, getDocs, query, where, setDoc, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { BLOGS, BOOKS, USERS } from './collections';
import { auth, db } from './config';

// AUTH METHOD

export const updateAuth = async (updatedAuthData) =>
  new Promise((resolve) => {
    updateProfile(auth.currentUser, updatedAuthData)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });

// read methods
export const getUserData = async (email) =>
  new Promise((resolve) => {
    const getUserQuery = query(collection(db, USERS), where('email', '==', email));
    getDocs(getUserQuery)
      .then((response) => {
        // console.log('response', response.docs);
        const arr = [];
        response.docs.forEach((doc) => {
          arr.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        if (arr.length > 0) resolve(arr[0]);
        else resolve(null);
      })
      .catch(() => {
        resolve(null);
      });
  });

export const getUserDataById = async () =>
  new Promise((resolve) => {
    const localUser = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null;
    const getUserQuery = query(
      collection(db, USERS),
      where('createdBy', '==', auth?.currentUser?.uid || localUser.uid)
    );
    getDocs(getUserQuery)
      .then((response) => {
        const arr = [];
        response.docs.forEach((doc) => {
          arr.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        if (arr.length > 0) resolve(arr[0]);
        else resolve(null);
      })
      .catch(() => {
        resolve(null);
      });
  });

// it will return all the data of books
export const getBooksData = async (bookId = null) =>
  new Promise((resolve) => {
    const getBookQuery = query(collection(db, BOOKS), where('id', '==', bookId));
    getDocs(getBookQuery)
      .then((response) => {
        const arr = [];
        response.docs.forEach((doc) => {
          arr.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        if (arr.length > 0) resolve(arr[0]);
        else resolve(null);
      })
      .catch(() => {
        resolve(null);
      });
  });

// it will return all the data of blogs
export const getBlogData = async (blogId = null) =>
  new Promise((resolve) => {
    const getBlogQuery = query(collection(db, BLOGS), where('id', '==', blogId));
    getDocs(getBlogQuery)
      .then((response) => {
        const arr = [];
        response.docs.forEach((doc) => {
          arr.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        if (arr.length > 0) resolve(arr[0]);
        else resolve(null);
      })
      .catch(() => {
        resolve(null);
      });
  });

// add methods

export const addUser = async (userData) =>
  new Promise((resolve) => {
    // console.log('userData', userData);
    const documentReference = doc(collection(db, USERS));
    setDoc(documentReference, {
      ...userData,
      createdBy: auth?.currentUser?.uid,
      createdAt: new Date(),
      id: documentReference.id,
    })
      .then(() => resolve(true))
      .catch(() => {
        resolve(false);
        // console.log('error', error);
      });
  });

export const addBook = async (bookData) =>
  new Promise((resolve) => {
    // console.log('userData', userData);
    const bookDocumentReference = doc(collection(db, BOOKS));
    setDoc(bookDocumentReference, {
      ...bookData,
      createdAt: new Date(),
      createdBy: auth?.currentUser?.uid,
      id: bookDocumentReference.id,
    })
      .then(() => resolve(true))
      .catch(() => {
        resolve(false);
        // console.log('error', error);
      });
  });

export const addBlog = async (blogData) =>
  new Promise((resolve) => {
    const blogDocumentReference = doc(collection(db, BLOGS));
    setDoc(blogDocumentReference, {
      ...blogData,
      createdAt: new Date(),
      createdBy: auth?.currentUser?.uid,
      id: blogDocumentReference.id,
    })
      .then(() => resolve(true))
      .catch((error) => {
        resolve(false);
        console.log('error', error);
      });
  });

// update methods

export const updateUser = async (updatedUserData) =>
  new Promise((resolve) => {
    updateDoc(doc(db, USERS, updatedUserData.id), { ...updatedUserData, updatedAt: new Date(), updates: increment(1) })
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });

export const updateItem = async (collectionName, documentId, updatedData) =>
  new Promise((resolve) => {
    updateDoc(doc(db, collectionName, documentId), { ...updatedData, updatedAt: new Date(), update: increment(1) })
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });

// delete methods

export const deleteBook = async (collectionName, documentId) =>
  new Promise((resolve) => {
    deleteDoc(doc(db, collectionName, documentId))
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
