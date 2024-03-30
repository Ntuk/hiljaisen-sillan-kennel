import './Dogs.scss'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";

export interface DogsData {
  id: string;
  name: string;
  birthday: Date;
  description: string;
  imageUrl: string;
}

interface Props {
  user: any;
}

function Dogs({ user }: Props) {
  const [data, setData] = useState<DogsData[]>([]);
  // const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDogsData = async () => {
      const dogsCollection = collection(db, 'dogs');
      const dogsSnapshot = await getDocs(dogsCollection);
      const dogsList: DogsData[] = dogsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        kennelName: doc.data().kennelName,
        birthday: doc.data().birthday,
        description: doc.data().content,
        imageUrl: doc.data().imageUrl
      }));

      setData(dogsList);
      console.log('Dogs data', data);
      console.log('user', user);
    };

    fetchDogsData();
  }, []);

  return (
    <section id={'koirat'} data-scroll={'koirat'} className={'dogs-container'}>
      <div className={'dogs-content'}>
        <div className={'dogs-header-container'}>
          <span className={'dogs-header'}>Koirat</span>
        </div>

      </div>
      <div className={'dogs-spacer'}/>
    </section>
)
}

export default Dogs
