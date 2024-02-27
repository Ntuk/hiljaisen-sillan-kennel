import './News.scss';
import Dialog from '../Dialog/Dialog.tsx';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase.ts';

interface NewsData {
  id: string;
  date: Date;
  title: string;
  content: string;
  imageUrl: string;
  views: number;
}

function News() {
  const [isOpen, setIsOpen] = useState<{ [id: string]: boolean }>({});
  const [data, setData] = useState<NewsData[]>([]);

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
      }));

      newsList.sort((a, b) => b.date.getTime() - a.date.getTime());

      setData(newsList);
    };

    fetchNewsData();
  }, []);


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

  const toggleDialog = (id: string) => {
    setIsOpen(prevState => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };

  return (
    <section id={'uutiset'} data-scroll={'uutiset'} className={'news-container'}>
      <div className={'news-content'}>
        <span className={'news-header'}>Ajankohtaista</span>
        <div className={'posts-container'}>
          <div className={'posts'}>
            {data.slice(0, 3).map(item => (
              <div key={item.id} className={'post-card'} onClick={() => toggleDialog(item.id)}>
                <Dialog
                  key={item.id}
                  heading={item.title}
                  date={item.date.toLocaleDateString('fi-FI', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  isOpen={!!isOpen[item.id]}
                  onClose={() => setIsOpen(prevState => ({...prevState, [item.id]: false}))}
                  fullScreen={window.innerWidth <= 1265}
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
                  <div className={'post-meta'}>{item.views} katselukertaa</div>
                </div>
              </div>
            ))}
          </div>
          <div className={'post-list'}>
            <span className={'post-header'}>Vanhemmat uutiset</span>
            {data.slice(3).map(item => (
              <div key={item.id} className={'post-link'} onClick={() => toggleDialog(item.id)}>
                <Dialog
                  key={item.id}
                  heading={item.title}
                  date={item.date.toLocaleDateString('fi-FI', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  isOpen={!!isOpen[item.id]}
                  onClose={() => setIsOpen(prevState => ({...prevState, [item.id]: false}))}
                  fullScreen={window.innerWidth <= 1265}
                >
                  <div className={'dialog-main-container'}>
                    <div className={'dialog-image'}>
                      <img src={item.imageUrl} alt={item.title}/>
                    </div>
                    <div className={'dialog-text'} dangerouslySetInnerHTML={{__html: item.content}}/>
                  </div>
                </Dialog>
                <div className={'mini-post-card'}>
                  <img src={item.imageUrl} alt={item.title} onClick={() => toggleDialog(item.id)}/>
                  <span className={'mini-post-date'}>{item.date.toLocaleDateString('fi-FI')}</span>
                  <div className={'mini-post-header'}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={'news-spacer'}/>
    </section>
  );
}

export default News;
