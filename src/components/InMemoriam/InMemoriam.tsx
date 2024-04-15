import './InMemoriam.scss'
import PageHeader from "../PageHeader/PageHeader.tsx";
import DogsCarousel from "../DogsCarousel/DogsCarousel.tsx";
import { useState } from "react";
import { DogsData } from "../Dogs/Dogs.tsx";
import DogInfo from "../DogInfo/DogInfo.tsx";

function InMemoriam({ dogsData }) {
  const [activeDog, setActiveDog] = useState<DogsData | null>(null);

  const handleDogChange = (newActiveDog: DogsData) => {
    setActiveDog(newActiveDog);
  };

  const deceasedDogsData = dogsData.filter(dog => dog.deceased !== undefined);

  return (
    <section id={'muistoissamme'} data-scroll={'muistoissamme'} className={'in-memoriam-container'}>
      <div className={'dogs-content'}>
        <div className={'dogs-content-container'}>
          <PageHeader
            title="Muistoissamme"
          />
         <div className={'carousel-container'}>
            <DogsCarousel data={deceasedDogsData} onDogChange={handleDogChange}/>
            <DogInfo dogInfo={activeDog}/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InMemoriam
