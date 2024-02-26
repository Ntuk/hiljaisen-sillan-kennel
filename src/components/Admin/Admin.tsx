import './Admin.scss';
import TextEditor, { TextEditorRef } from "./TextEditor.tsx";
import { FormEvent, useRef, useState } from "react";
import ImageUpload from "./ImageUpload.tsx";
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase.ts";

interface NewsFormData {
  date: Date;
  title: string;
  content: string;
  imageUrl: string;
  views: number;
}

function Admin() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const titleRef = useRef<HTMLInputElement>(null);
  const textEditorRef = useRef<TextEditorRef>(null);
  const [textEditorValue, setTextEditorValue] = useState<string>('');
  const [formData, setFormData] = useState<NewsFormData>({
    date: new Date(),
    title: '',
    content: '',
    imageUrl: '',
    views: 0
  });

  const handleImageUpload = (images) => {
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
        date: new Date(),
        title: title,
        content: content,
        imageUrl: image,
        views: 0
      };

      setFormData(newData);
      console.log("Form data submitted:", formData);

      const addDataToFirestore = async () => {
        try {
          const docRef = await addDoc(collection(db, 'news'), newData);
          console.log('Document written with ID: ', docRef.id);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      };

      addDataToFirestore().then(() => setFormData({
        date: new Date(),
        title: '',
        content: '',
        imageUrl: '',
        views: 0
      }));
    }
  };


  return (
    <section id={'admin'} data-scroll={'admin'} className={'admin-container'}>
      <div className={'admin-content'}>
        <form onSubmit={handleSubmit}>
          <div className={'item'}>
            <span>Otsikko:</span>
            <input type="text" name="name" ref={titleRef}/>
          </div>
          <div className={'item'}>
            <span>Lisää kuva:</span>
            <ImageUpload onImageUpload={handleImageUpload} onBase64Upload={handleBase64Upload} />
          </div>
          <div className={'item'}>
            Postauksen teksti:
            <TextEditor ref={textEditorRef} onSubmit={handleTextEditorSubmit} />
          </div>
          <br/>
          <button type="submit">Lähetä</button>
        </form>
      </div>
    </section>
  );
}

export default Admin;
