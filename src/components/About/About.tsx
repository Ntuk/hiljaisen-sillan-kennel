import './About.scss';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
import AboutAdmin from "../AboutAdmin/AboutAdmin.tsx";
import PageHeader from "../PageHeader/PageHeader.tsx";

export interface AboutData {
  id: string;
  content: string;
  imageUrl: string;
}

function About() {
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

  const editAboutButton = (
    <button className={'painike'} onClick={editAbout}>
      Muokkaa
    </button>
  );

  const backToAboutButton = (
    <button className={'painike'} onClick={() => setIsAdminOpen(false)}>
      Takaisin
    </button>
  );

  return (
    <section id={'meistä'} data-scroll={'meistä'} className={'about-container'}>
      <div className={'about-content'}>
        <div className={'about-header-text-container'}>
          <PageHeader
            title="Meistä"
            isAdminOpen={isAdminOpen}
            leftButton={editAboutButton}
            rightButton={backToAboutButton}
          />
          {isAdminOpen ? <AboutAdmin formData={formData} setIsAdminOpen={setIsAdminOpen} onFormSubmit={() => setFormSubmitted(true)} /> :
            <div className={'about-text'}>
              {data.map(item => (
                <div key={item.id}>
                  <div className={'image'} key={item.id}>
                    <img src={item.imageUrl} alt={'Kuva'} key={item.id} />
                  </div>
                  <span dangerouslySetInnerHTML={{__html: item.content }}>
                  </span>
                </div>
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
