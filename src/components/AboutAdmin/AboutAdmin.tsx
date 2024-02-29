import './AboutAdmin.scss';
import TextEditor, { TextEditorRef } from "./TextEditor.tsx";
import { FormEvent, useEffect, useRef, useState } from "react";
import AboutImageUpload from "./AboutImageUpload.tsx";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase.ts";
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

interface AboutFormData {
  id?: string;
  content: string;
  imageUrl: string;
}

interface AboutAdminProps {
  formData?: AboutFormData;
  setIsAdminOpen?: (value: boolean) => void;
  onFormSubmit: any;
}

function AboutAdmin({ formData, setIsAdminOpen, onFormSubmit }: AboutAdminProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [textEditorValue, setTextEditorValue] = useState<string>('');
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
      setTextEditorValue(formData.content || '');
      setImageUrl(formData.imageUrl || '');
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
    const content = textEditorValue;
    const image = imageUrl;

    if (content && image) {
      const newData: AboutFormData = {
        content: content,
        imageUrl: image,
      };

      console.log("Form data submitted:", newData);

      const editAboutDataInFirestore = async () => {
        try {
          if (formData && formData.id) {
            const newDataForUpdate: { [key: string]: any } = {
              content: newData.content,
              imageUrl: newData.imageUrl
            };

            await updateDoc(doc(db, 'about', formData.id), newDataForUpdate);

            console.log('About content updated with ID: ', formData.id);
            notifySuccess('Meistä -osio päivitetty onnistuneesti');
            setIsAdminOpen(false);
            onFormSubmit();
          }
        } catch (e) {
          console.error('Error updating document: ', e);
          notifyError('Jotain meni perseelleen');
        }
      };

      editAboutDataInFirestore();

    }
  };

  return (
    <section id={'admin'} data-scroll={'admin'} className={'admin-container'}>
      <div className={'admin-content'}>
        <form onSubmit={handleSubmit}>
          <div className={'items-container'}>
            <div className={'text-items'}>
              <div className={'item'}>
                <span>Esittelyteksti:</span>
                <TextEditor ref={textEditorRef} onSubmit={handleTextEditorSubmit} value={textEditorValue} />
              </div>
            </div>
            <div className={'item'}>
              <span>Vaihda kuva:</span>
              <AboutImageUpload onImageUpload={handleImageUpload} onBase64Upload={handleBase64Upload} previewImage={imageUrl} />
            </div>
          </div>
          <br/>
          <button className={'painike'} type="submit">Lähetä</button>
        </form>
      </div>
    </section>
  );
}

export default AboutAdmin;
