import './NewsAdmin.scss';
import TextEditor, { TextEditorRef } from "./TextEditor.tsx";
import { FormEvent, useEffect, useRef, useState } from "react";
import ImageUpload from "./ImageUpload.tsx";
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase.ts";
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

interface NewsFormData {
  id?: string;
  editedDate?: Date;
  date: Date;
  title: string;
  content: string;
  imageUrl: string;
  views: number;
}

interface NewsAdminProps {
  formData?: NewsFormData;
  setIsAdminOpen?: (value: boolean) => void;
  onFormSubmit: any;
}

function NewsAdmin({ formData, setIsAdminOpen, onFormSubmit }: NewsAdminProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [textEditorValue, setTextEditorValue] = useState<string>('');

  const titleRef = useRef<HTMLInputElement>(null);
  const textEditorRef = useRef<TextEditorRef>(null);
  const notifySuccess = (message) => toast(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    type: "success",
    theme: "light",
    transition: Bounce,
  });
  const notifyError = (message) => toast(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    type: "error",
    theme: "light",
    transition: Bounce,
  });

  useEffect(() => {
    if (formData) {
      titleRef.current.value = formData.title;
      setImageUrl(formData.imageUrl || '');
      setTextEditorValue(formData.content || '');
    }
  }, [formData]);

  const handleImageUpload = (images: any[]) => {
    if (images.length > 0) {
      const base64Image = images[0].data_url;
      setImageUrl(base64Image);
    }
  };

  const handleTextEditorSubmit = (content: string) => {
    setTextEditorValue(content);
  };

  const handleBase64Upload = (base64Images: string[]) => {
    console.log('base64Image', base64Images);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    const content = textEditorValue;
    const image = imageUrl;

    if (title && content && image) {
      const newData: NewsFormData = {
        date: formData ? formData.date : new Date(),
        title: title,
        content: content,
        imageUrl: image,
        views: formData ? formData.views : 0
      };

      console.log("Form data submitted:", newData);

      const addDataToFirestore = async () => {
        try {
          if (formData && formData.id) {
            const newDataForUpdate: { [key: string]: any } = {
              date: newData.date,
              title: newData.title,
              content: newData.content,
              imageUrl: newData.imageUrl,
              views: newData.views,
              editedDate: new Date()
            };

            const docSnapshot = await getDoc(doc(db, 'news', formData.id));
            if (docSnapshot.exists()) {
              newDataForUpdate.views = docSnapshot.data().views;
            }

            await updateDoc(doc(db, 'news', formData.id), newDataForUpdate);
            console.log('Document updated with ID: ', formData.id);
            notifySuccess('Uutinen päivitetty onnistuneesti');
            setIsAdminOpen(false);
            onFormSubmit();
          } else {
            const docRef = await addDoc(collection(db, 'news'), newData);
            console.log('Document written with ID: ', docRef.id);
            notifySuccess('Uutinen lisätty onnistuneesti');
            setIsAdminOpen(false);
            onFormSubmit();
          }
        } catch (e) {
          console.error('Error adding document: ', e);
          notifyError('Jotain meni perseelleen');
        }
      };

      addDataToFirestore();
    }
  };

  return (
    <section id={'admin'} data-scroll={'admin'} className={'news-admin-container'}>
      <div className={'news-admin-content'}>
        <form onSubmit={handleSubmit}>
          <div className={'items-container'}>
            <div className={'text-items'}>
              <div className={'item header'}>
                <span>Otsikko:</span>
                <input type="text" name="name" ref={titleRef}/>
              </div>
              <div className={'item'}>
                <span>Uutinen:</span>
                <TextEditor ref={textEditorRef} onSubmit={handleTextEditorSubmit} value={textEditorValue} />
              </div>
            </div>
            <div className={'item'}>
              <span>Lisää kuva:</span>
              <ImageUpload onImageUpload={handleImageUpload} onBase64Upload={handleBase64Upload} previewImage={imageUrl} />
            </div>
          </div>
          <br/>
          <button className={'painike'} type="submit">Lähetä</button>
        </form>
      </div>
    </section>
  );
}

export default NewsAdmin;
