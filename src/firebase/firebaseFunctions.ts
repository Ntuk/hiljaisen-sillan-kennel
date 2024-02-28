import { collection, getDocs, deleteDoc, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from './firebase.ts';
import { AboutData, NewsData } from "./interfaces.ts";

// NEWS //

export async function fetchNewsData(): Promise<NewsData[]> {
  const newsCollection = collection(db, 'news');
  const newsSnapshot = await getDocs(newsCollection);
  return newsSnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    content: doc.data().content,
    date: new Date(doc.data().date.seconds * 1000),
    imageUrl: doc.data().imageUrl,
    views: doc.data().views,
    editedDate: new Date(doc.data().editedDate?.seconds * 1000),
  }));
}

export async function updateNewsViews(id: string, updatedViews: number): Promise<void> {
  await updateDoc(doc(db, 'news', id), { views: updatedViews });
}

export async function deleteNewsPost(id: string): Promise<void> {
  await deleteDoc(doc(db, 'news', id));
}

export async function addNewsPost(data: Partial<NewsData>): Promise<string> {
  const docRef = await addDoc(collection(db, 'news'), data);
  return docRef.id;
}

// ABOUT //

export async function fetchAboutData(): Promise<AboutData[]> {
  const aboutCollection = collection(db, 'about');
  const aboutSnapshot = await getDocs(aboutCollection);
  return aboutSnapshot.docs.map(doc => ({
    id: doc.id,
    content: doc.data().content,
  }));
}

