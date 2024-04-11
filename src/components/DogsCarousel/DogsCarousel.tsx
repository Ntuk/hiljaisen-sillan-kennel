import './DogsCarousel.scss';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { DogsData } from "../Dogs/Dogs.tsx";
import { useEffect, useRef, useState } from "react";

interface DogsCarouselProps {
  data: DogsData[];
  onDogChange: (activeDog: DogsData) => void;
}

function DogsCarousel({ data, onDogChange }: DogsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeDog, setActiveDog] = useState<DogsData | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousActiveDogRef = useRef<DogsData | null>(null);

  useEffect(() => {
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 15000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [data]);

  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const newActiveDog = data[currentIndex];
    setActiveDog(newActiveDog);
  }, [currentIndex, data]);

  useEffect(() => {
    if (activeDog && activeDog !== previousActiveDogRef.current) {
      onDogChange(activeDog);
      previousActiveDogRef.current = activeDog;
    }
  }, [activeDog, onDogChange]);

  const handleOnChange = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      interval={15000}
      onChange={handleOnChange}
      selectedItem={currentIndex}
    >
      {data.map((dog) => (
        <div key={dog.id}>
          <img src={dog.imageUrl} alt={dog.name} />
        </div>
      ))}
    </Carousel>
  );
}

export default DogsCarousel;
