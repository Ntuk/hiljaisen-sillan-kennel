import './About.scss';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
import AboutAdmin from "../AboutAdmin/AboutAdmin.tsx";

export interface AboutData {
  id: string;
  content: string;
  imageUrl: string;
}

interface Props {
  user: any;
}

function About({ user }: Props) {
  const [data, setData] = useState<AboutData[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<AboutData | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      const aboutCollection = collection(db, 'about');
      const aboutSnapshot = await getDocs(aboutCollection);
      const aboutList: AboutData[] = aboutSnapshot.docs.map(doc => ({
        id: doc.id,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl
      }));

      setData(aboutList);
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      const aboutCollection = collection(db, 'about');
      const aboutSnapshot = await getDocs(aboutCollection);
      const aboutList: AboutData[] = aboutSnapshot.docs.map(doc => ({
        id: doc.id,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl
      }));

      setData(aboutList);
    };

    if (formSubmitted) {
      fetchAboutData();
      setFormSubmitted(false);
    }
  }, [formSubmitted]);

  const editAbout = async () => {
    const aboutData = data.find(aboutData => aboutData.content);
    setIsAdminOpen(true);
    setFormData(aboutData ? {...aboutData} : null);
  };

  return (
    <section id={'meistä'} data-scroll={'meistä'} className={'about-container'}>
      <div className={'about-content'}>
        <div className={'about-header-text-container'}>
          <div className={'about-header-container'}>
            <span className={'about-header'}>Meistä</span>
            {user && !isAdminOpen && (
              <button className={'painike'} onClick={editAbout}>Muokkaa</button>
            )}
          </div>
          {isAdminOpen ? <AboutAdmin formData={formData} setIsAdminOpen={setIsAdminOpen} onFormSubmit={() => setFormSubmitted(true)} /> :
            <div className={'about-text'}>
              {data.map(item => (
                <>
                  <div className={'image'} key={item.id}>
                    <img src={item.imageUrl} alt={'Kuva'} />
                  </div>
                  <span dangerouslySetInnerHTML={{__html: item.content }}>
                  </span></>
                ))}
            </div>
          }
        </div>
      </div>
      <div className={'about-spacer'}/>
    </section>
  )
}

export default About
