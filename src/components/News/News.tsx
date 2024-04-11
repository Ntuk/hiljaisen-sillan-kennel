import './News.scss';
import Dialog from '../Dialog/Dialog.tsx';
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.ts';
import NewsAdmin from "../NewsAdmin/NewsAdmin.tsx";
import { FaRegEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader.tsx";

interface NewsData {
  id: string;
  date: Date;
  title: string;
  content: string;
  imageUrl: string;
  views: number;
  editedDate?: Date;
}

function News({ user }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<{ [id: string]: boolean }>({});
  const [data, setData] = useState<NewsData[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<NewsData | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchNewsData = async () => {
      const newsCollection = collection(db, 'news');
      const newsSnapshot = await getDocs(newsCollection);
      const newsList: NewsData[] = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        date: new Date(doc.data().date.seconds * 1000),
        imageUrl: doc.data().imageUrl,
        views: doc.data().views,
        editedDate: new Date(doc.data().editedDate?.seconds * 1000),
      }));

      newsList.sort((a, b) => b.date.getTime() - a.date.getTime());

      setData(newsList);
    };

    fetchNewsData();
  }, []);

  useEffect(() => {
    const fetchNewsData = async () => {
      const newsCollection = collection(db, 'news');
      const newsSnapshot = await getDocs(newsCollection);
      const newsList: NewsData[] = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        date: new Date(doc.data().date.seconds * 1000),
        imageUrl: doc.data().imageUrl,
        views: doc.data().views,
        editedDate: new Date(doc.data().editedDate?.seconds * 1000),
      }));

      newsList.sort((a, b) => b.date.getTime() - a.date.getTime());

      setData(newsList);
    };

    if (formSubmitted) {
      fetchNewsData();
      setFormSubmitted(false);
    }
  }, [formSubmitted]);

  useEffect(() => {
    const fetchAndOpenPost = async () => {
      try {
        const docRef = doc(db, 'news', slug);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          // Open dialog with post data
          const postData = {
            id: docSnapshot.id,
            title: docSnapshot.data().title,
            content: docSnapshot.data().content,
            date: new Date(docSnapshot.data().date.seconds * 1000),
            imageUrl: docSnapshot.data().imageUrl,
            views: docSnapshot.data().views,
            editedDate: new Date(docSnapshot.data().editedDate?.seconds * 1000),
          };
          setIsOpen({ [postData.id]: true });
          setData([postData]); // Set data to display only the single post
        } else {
          // Handle post not found
          navigate('/'); // Redirect to home or another page
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    if (slug) {
      fetchAndOpenPost();
    }
  }, [slug, navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        for (const id in isOpen) {
          if (isOpen[id]) {
            setIsOpen(prevState => ({
              ...prevState,
              [id]: false,
            }));
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDialog = async (id: string) => {
    const updatedData = data.map(item => {
      if (item.id === id) {
        const updatedViews = item.views + 1;
        updateDoc(doc(db, 'news', id), { views: updatedViews });
        return { ...item, views: updatedViews };
      }
      return item;
    });
    setData(updatedData);

    setIsOpen(prevState => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };

  const handleAdminClick = () => {
    setIsAdminOpen(!isAdminOpen);
    setIsOpen({});
    setFormData(null);
  };

  const editPost = async (id: string) => {
    const postToEdit = data.find(post => post.id === id);
    console.log('post.views', postToEdit.views);
    setIsAdminOpen(true);
    setFormData(postToEdit ? {...postToEdit} : null);
  };

  const openDeleteConfirmation = (id: string) => {
    setDeletePostId(id);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setDeletePostId('');
  };

  const confirmDeletePost = async () => {
    try {
      await deleteDoc(doc(db, 'news', deletePostId));
      console.log('Post successfully deleted.');
      // Refresh the data after deletion
      const updatedData = data.filter(item => item.id !== deletePostId);
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    closeDeleteConfirmation();
  };

  const writeNewsButton = user ? (
    <button className={'painike'} onClick={handleAdminClick}>
      Kirjoita uusi uutinen
    </button>
  ) : null;

  const backToNewsButton = user ? (
    <button className={'painike'} onClick={handleAdminClick}>
      Takaisin uutisiin
    </button>
  ) : null;

  return (
    <section id={'uutiset'} data-scroll={'uutiset'} className={'news-container'}>
      <div className={'news-content'}>
        <PageHeader
          title="Ajankohtaista"
          isAdminOpen={isAdminOpen}
          leftButton={writeNewsButton}
          rightButton={backToNewsButton}
        />
        {isAdminOpen ? <NewsAdmin formData={formData} setIsAdminOpen={setIsAdminOpen} onFormSubmit={() => setFormSubmitted(true)} /> : <div className={'posts-container'}>
          <div className={'posts'}>
            {data.slice(0, 3).map(item => (
              <div key={item.id} className={'post-card'} onClick={() => toggleDialog(item.id)}>
                <Dialog
                  key={item.id}
                  heading={item.title}
                  id={item.id}
                  user={user}
                  editPost={() => editPost(item.id)}
                  deletePost={() => openDeleteConfirmation(item.id)}
                  editedDate={item.editedDate instanceof Date ? item.editedDate.toLocaleDateString('fi-FI', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) || '' : ''}
                  date={item.date.toLocaleDateString('fi-FI', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  isOpen={!!isOpen[item.id]}
                  onClose={() => setIsOpen(prevState => ({...prevState, [item.id]: false}))}
                  fullScreen={window.innerWidth <= 934}
                >
                  <div className={'dialog-main-container'}>
                    <div className={'dialog-image'}>
                      <img src={item.imageUrl} alt={item.title}/>
                    </div>
                    <div className={'dialog-text'} dangerouslySetInnerHTML={{__html: item.content}}/>
                  </div>
                </Dialog>
                <div className={'post-image'}>
                  <img src={item.imageUrl} alt={item.title}/>
                </div>
                <div className={'post-content-container'}>
                  {isAdminOpen && <NewsAdmin formData={formData} onFormSubmit={() => setFormSubmitted(true)} />}
                  <div className={'post-main-info'}>
                    <div className={'post-date'}>{item.date.toLocaleDateString('fi-FI', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</div>
                    <div className={'post-header'}>{item.title}</div>
                    <div className={'post-preview'}
                         dangerouslySetInnerHTML={{__html: item.content.length > 240 ? item.content.substring(0, 240) + "..." : item.content}}/>
                  </div>
                  <div className={'post-meta'}><FaRegEye /> {item.views} lukukertaa</div>
                </div>
              </div>
            ))}
          </div>
          {data.length > 3 && (
            <div className={'post-list'}>
              <span className={'post-header'}>Vanhemmat uutiset</span>
              {data.slice(3).map(item => (
                <div key={item.id} className={'post-link'} onClick={() => toggleDialog(item.id)}>
                  <Dialog
                    key={item.id}
                    heading={item.title}
                    id={item.id}
                    user={user}
                    editPost={() => editPost(item.id)}
                    deletePost={() => openDeleteConfirmation(item.id)}
                    editedDate={item.editedDate instanceof Date ? item.editedDate.toLocaleDateString('fi-FI', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || '' : ''}
                    date={item.date.toLocaleDateString('fi-FI', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    isOpen={!!isOpen[item.id]}
                    onClose={() => setIsOpen(prevState => ({...prevState, [item.id]: false}))}
                    fullScreen={window.innerWidth <= 1024}
                  >
                    <div className={'dialog-main-container'}>
                      <div className={'dialog-image'}>
                        <img src={item.imageUrl} alt={item.title}/>
                      </div>
                      <div className={'dialog-text'} dangerouslySetInnerHTML={{__html: item.content}}/>
                    </div>
                  </Dialog>
                  <div className={'mini-post-card'}>
                    <div className={'mini-post-meta'}><FaRegEye /> {item.views}</div>
                    <img src={item.imageUrl} alt={item.title} onClick={() => toggleDialog(item.id)}/>
                    <span className={'mini-post-date'}>{item.date.toLocaleDateString('fi-FI')}</span>
                    <div className={'mini-post-header'}>{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>}
      </div>
      <div className={'news-spacer'}/>
      <Dialog
        heading="Haluatko varmasti poistaa tämän postauksen?"
        confirmationDialog={true}
        isOpen={deleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
      >
        <div className="delete-confirmation-dialog">
          <button className={'painike'} onClick={confirmDeletePost}>Kyllä</button>
          <button className={'painike'} onClick={closeDeleteConfirmation}>Peruuta</button>
        </div>
      </Dialog>
    </section>
  );
}

export default News;
