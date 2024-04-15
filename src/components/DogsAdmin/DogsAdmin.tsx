import './DogsAdmin.scss';
import { FormEvent, useEffect, useRef, useState } from "react";
import { collection, addDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from "../../firebase/firebase.ts";
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUpload from "../ImageUpload/ImageUpload.tsx";
import { ImageType } from "react-images-uploading/dist/typings";
import { FaCross } from "react-icons/fa";

interface DogsFormData {
  id?: string;
  name: string;
  kennelName: string;
  mom: string;
  dad: string;
  birthday: Date;
  description: string;
  size: string;
  imageUrl: string;
  deceased?: Date;
}

interface DogsAdminProps {
  formData?: DogsFormData;
  setIsAdminOpen?: (value: boolean) => void;
  onFormSubmit: () => void;
}

function DogsAdmin({ formData, setIsAdminOpen, onFormSubmit }: DogsAdminProps) {
  const [name, setName] = useState<string>('');
  const [kennelName, setKennelName] = useState<string>('');
  const [mom, setMom] = useState<string>('');
  const [dad, setDad] = useState<string>('');
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [deceased, setDeceased] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [dogs, setDogs] = useState<DogsFormData[]>([]);
  const [selectedDog, setSelectedDog] = useState<DogsFormData | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const kennelNameRef = useRef<HTMLInputElement>(null);
  const momRef = useRef<HTMLInputElement>(null);
  const dadRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const deceasedRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (formData) {
      setName(formData.name);
      setKennelName(formData.kennelName);
      setMom(formData.mom);
      setDad(formData.dad);
      setBirthday(formData.birthday);
      setDeceased(formData.deceased);
      setDescription(formData.description);
      setSize(formData.size);
      setImageUrl(formData.imageUrl);
    }
  }, [formData]);

  const notifySuccess = (message: string) => {
    toast(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      type: "success",
      theme: "light",
      transition: Bounce,
    });
  };

  const notifyError = (message: string) => {
    toast(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      type: "error",
      theme: "light",
      transition: Bounce,
    });
  };

  const handleImageUpload = (images: ImageType[]) => {
    if (images.length > 0) {
      const uploadedImageUrl = images[0].data_url;
      setImageUrl(uploadedImageUrl);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Retrieve values from state
    const newName = nameRef.current?.value;
    // Retrieve values from other input fields as needed

    const existingDog = dogs.find(dog => dog.name === newName);
    if (existingDog) {
      notifyError(`${existingDog.name} on jo lisätty.`);
      return;
    }

    if (newName) {
      const newFormData: DogsFormData = {
        name: newName,
        kennelName: kennelName,
        mom: mom,
        dad: dad,
        birthday: birthday,
        description: description,
        size: size,
        imageUrl: imageUrl
      };

      if (deceased) {
        newFormData.deceased = deceased;
      }

      console.log("Form data submitted:", newFormData);

      try {
        if (selectedDog) {
          // Update an existing dog
          const newDataForUpdate = { ...newFormData };
          await updateDoc(doc(db, 'dogs', selectedDog.id), newDataForUpdate);
          console.log('Document updated with ID: ', selectedDog.id);
          notifySuccess(`${selectedDog.name}n tiedot päivitetty onnistuneesti.`);
          setIsAdminOpen(false);
          onFormSubmit();
        } else {
          // Add a new dog
          const docRef = await addDoc(collection(db, 'dogs'), newFormData);
          console.log('Document written with ID: ', docRef.id);
          notifySuccess(`${selectedDog.name} lisätty onnistuneesti.`);
          setIsAdminOpen(false);
          onFormSubmit();
        }
      } catch (error) {
        console.error('Error adding/updating document: ', error);
        notifyError('Something went wrong');
      }
    }
  };

  useEffect(() => {
    // Fetch all dogs from the database
    const fetchDogs = async () => {
      const dogList: DogsFormData[] = [];
      const querySnapshot = await getDocs(collection(db, 'dogs'));
      querySnapshot.forEach((doc) => {
        dogList.push({ id: doc.id, ...doc.data() } as DogsFormData);
      });
      setDogs(dogList);
    };

    fetchDogs();
  }, []);

  const handleDogSelect = (dog: DogsFormData) => {
    setSelectedDog(dog);
    setName(dog.name);
    setKennelName(dog.kennelName);
    setMom(dog.mom);
    setDad(dog.dad);
    setBirthday(dog.birthday);
    setDeceased(dog.deceased);
    setDescription(dog.description);
    setSize(dog.size);
    setImageUrl(dog.imageUrl);
  };

  const handleBase64Upload = (base64Images: string[]) => {
    console.log('base64Images', base64Images);
  };

  const setFormattedBirthday = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const formattedMonth = month.length === 1 ? `0${month}` : month;
    const formattedDate = new Date(`${year}-${formattedMonth}-${day}`);
    setBirthday(formattedDate);
  };

  const setFormattedDeceased = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const formattedMonth = month.length === 1 ? `0${month}` : month;
    const formattedDate = new Date(`${year}-${formattedMonth}-${day}`);
    setDeceased(formattedDate);
  };

  return (
    <section id={'admin'} data-scroll={'admin'} className={'admin-container'}>
      <div className={'admin-content'}>
        <div className={'dogs-admin-container'}>
          <div className={'dogs-list'}>
            <span className={'header'}>Valitse koira:</span>
            {dogs.map((dog) => (
              <div className={'dog-avatar-button'} key={dog.id}>
                <button onClick={() => handleDogSelect(dog)} className={'painike'}>{dog.name}</button>
                <img className={'dog-avatar'} src={dog.imageUrl} alt={dog.name} />
              </div>
            ))}
          </div>
          <div className={'dogs-admin-edit'}>
            <form onSubmit={handleSubmit}>
              <div className={'items-container'}>
                <div className={'item header'}>
                  <span>Nimi:</span>
                  <input type="text" name="name" ref={nameRef} defaultValue={name}
                         onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className={'item header'}>
                  <span>Kennelnimi:</span>
                  <input type="text" name="kennelName" defaultValue={kennelName} ref={kennelNameRef}
                         onChange={(e) => setKennelName(e.target.value)}/>
                </div>
                <div className={'items-container'}>
                  <div className={'item header'}>
                    <span>Äiti:</span>
                    <input type="text" name="mom" defaultValue={mom} ref={momRef}
                           onChange={(e) => setMom(e.target.value)}/>
                  </div>
                  <div className={'item header'}>
                    <span>Isä:</span>
                    <input type="text" name="dad" defaultValue={dad} ref={dadRef}
                           onChange={(e) => setDad(e.target.value)}/>
                  </div>
                  <div className={'item header'}>
                    <span>Rotu/koko:</span>
                    <input type="text" name="size" defaultValue={size} ref={sizeRef}
                           onChange={(e) => setSize(e.target.value)}/>
                  </div>
                  <div className={'item header'}>
                    <span>Syntymäpäivä:</span>
                    <input type="date" name="birthday"
                           defaultValue={birthday instanceof Date ? birthday.toISOString().substr(0, 10) : ''}
                           ref={birthdayRef} onChange={(e) => setFormattedBirthday(e.target.value)}/>
                  </div>
                  <div className={'item header'}>
                    <span>Kuolinpäivä <FaCross/> (voi jättää täyttämättä):</span>
                    <input type="date" name="deceased"
                           defaultValue={deceased instanceof Date ? deceased.toISOString().substr(0, 10) : ''}
                           ref={deceasedRef} onChange={(e) => setFormattedDeceased(e.target.value)}/>
                  </div>
                  <div className={'item header'}>
                    <span>Kuvaus:</span>
                    <textarea name="description" defaultValue={description} ref={descriptionRef}
                              onChange={(e) => setDescription(e.target.value)}/>
                  </div>
                  <div className={'item header'}>
                    <span>Kuva:</span>
                    <ImageUpload onImageUpload={handleImageUpload} previewImage={imageUrl}
                                 onBase64Upload={handleBase64Upload}/>
                  </div>
                </div>
              </div>
              <br/>
              <button className={'painike'} type="submit">Lähetä</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DogsAdmin;
