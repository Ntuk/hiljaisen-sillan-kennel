import './Dogs.scss'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
import PageHeader from "../PageHeader/PageHeader.tsx";
import DogsCarousel from "../DogsCarousel/DogsCarousel.tsx";
import DogInfo from "../DogInfo/DogInfo.tsx";
import DogsAdmin from "../DogsAdmin/DogsAdmin.tsx";

export interface DogsData {
  id: string;
  name: string;
  kennelName: string;
  mom: string;
  dad: string;
  birthday: Date;
  description: string;
  size: string;
  imageUrl: string;
  deceased?: Date
}

function Dogs({ user }) {
  const [data, setData] = useState<DogsData[]>([]);
  const [activeDog, setActiveDog] = useState<DogsData | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDogsData = async () => {
      const dogsCollection = collection(db, 'dogs');
      const dogsSnapshot = await getDocs(dogsCollection);
      const dogsList: DogsData[] = dogsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        kennelName: doc.data().kennelName,
        mom: doc.data().mom,
        dad: doc.data().dad,
        birthday: doc.data().birthday.toDate(),
        description: doc.data().description,
        size: doc.data().size,
        imageUrl: doc.data().imageUrl,
        deceased: doc.data().deceased?.toDate(),
      }));

      setData(dogsList);
    };

    fetchDogsData();
  }, []);

  const handleDogChange = (newActiveDog: DogsData) => {
    setActiveDog(newActiveDog);
  };

  const handleFormSubmit = () => {
    const fetchDogsData = async () => {
      const dogsCollection = collection(db, 'dogs');
      const dogsSnapshot = await getDocs(dogsCollection);
      const dogsList: DogsData[] = dogsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        kennelName: doc.data().kennelName,
        mom: doc.data().mom,
        dad: doc.data().dad,
        birthday: doc.data().birthday.toDate(),
        description: doc.data().description,
        size: doc.data().size,
        imageUrl: doc.data().imageUrl,
        deceased: doc.data().deceased,
      }));

      setData(dogsList);
    };

    fetchDogsData();
  };

  const editDogs = async () => {
    setIsAdminOpen(true);
  };

  const editDogsButton = user ? (
    <button className={'painike'} onClick={editDogs}>
      Muokkaa
    </button>
  ) : null;

  const backToDogsButton = user ? (
    <button className={'painike'} onClick={() => setIsAdminOpen(false)}>
      Takaisin
    </button>
  ) : null;

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
          {isAdminOpen ? <DogsAdmin onFormSubmit={handleFormSubmit} setIsAdminOpen={setIsAdminOpen} /> :
                <div className={'carousel-container'}>
            <DogsCarousel data={data} onDogChange={handleDogChange} />
            <DogInfo dogInfo={activeDog} />
          </div>
          }
        </div>
      </div>
      <div className={'dogs-spacer'}/>
    </section>
  )
}

export default Dogs
