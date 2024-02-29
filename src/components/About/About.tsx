import './About.scss';
import avatarImage from '../../assets/minna_ja_doggot.jpg';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";

export interface AboutData {
  id: string;
  content: string;
}

interface Props {
  user: any;
}

function About({ user }: Props) {
  const [data, setData] = useState<AboutData[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchNewsData = async () => {
      const aboutCollection = collection(db, 'about');
      const aboutSnapshot = await getDocs(aboutCollection);
      const aboutList: AboutData[] = aboutSnapshot.docs.map(doc => ({
        id: doc.id,
        content: doc.data().content,
      }));

      setData(aboutList);
    };

    fetchNewsData();
  }, []);

  const handleAdminClick = () => {
    setIsAdminOpen(!isAdminOpen);
    console.log('Open admin view..', isAdminOpen);
  };

  return (
    <section id={'meistä'} data-scroll={'meistä'} className={'about-container'}>
      <div className={'about-content'}>
        <div className={'about-header-text-container'}>
          <div className={'about-header-container'}>
            <span className={'about-header'}>Meistä</span>
            {user && !isAdminOpen && (
              <button className={'painike'} onClick={handleAdminClick}>Muokkaa</button>
            )}
          </div>
          <div className={'about-text'}>
            <div className={'image'}>
              <img src={avatarImage}/>
            </div>
            {data.map(item => (
              item.content
            ))}
          </div>
        </div>
      </div>
      <div className={'about-spacer'}/>
    </section>
  )
}

export default About
