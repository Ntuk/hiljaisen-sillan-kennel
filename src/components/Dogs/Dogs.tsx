import './Dogs.scss'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
import PageHeader from "../PageHeader/PageHeader.tsx";

export interface DogsData {
  id: string;
  name: string;
  birthday: Date;
  description: string;
  imageUrl: string;
}

function Dogs() {
  const [data, setData] = useState<DogsData[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDogsData = async () => {
      const dogsCollection = collection(db, 'dogs');
      const dogsSnapshot = await getDocs(dogsCollection);
      const dogsList: DogsData[] = dogsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        mom: doc.data().mom,
        dad: doc.data().dad,
        kennelName: doc.data().kennelName,
        birthday: doc.data().birthday,
        description: doc.data().description,
        imageUrl: doc.data().imageUrl
      }));

      setData(dogsList);
      console.log('isAdminOpen', isAdminOpen);
    };

    fetchDogsData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log('Dogs data', data);
    }
  }, [data]);

  const editDogs = async () => {
    console.log('edit dogs..')
    // const aboutData = data.find(aboutData => aboutData.content);
    // setIsAdminOpen(true);
    // setFormData(aboutData ? {...aboutData} : null);
  };

  const editDogsButton = (
    <button className={'painike'} onClick={editDogs}>
      Muokkaa
    </button>
  );

  const backToDogsButton = (
    <button className={'painike'} onClick={() => setIsAdminOpen(false)}>
      Takaisin
    </button>
  );

  return (
    <section id={'koirat'} data-scroll={'koirat'} className={'dogs-container'}>
      <div className={'dogs-content'}>
        <div className={'dogs-content-container'}>
          <PageHeader
            title="Koirat"
            isAdminOpen={isAdminOpen}
            leftButton={editDogsButton}
            rightButton={backToDogsButton}
          />
        </div>
      </div>
      <div className={'dogs-spacer'}/>
    </section>
)
}

export default Dogs
