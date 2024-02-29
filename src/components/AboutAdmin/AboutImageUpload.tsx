import ImageUploading from 'react-images-uploading';
import { ImageType } from "react-images-uploading/dist/typings";
import { useEffect, useState } from "react";

interface AboutImageUploadProps {
  onImageUpload: (images: ImageType[]) => void;
  onBase64Upload: (base64Images: string[]) => void;
  previewImage?: string;
}

function AboutImageUpload({ onImageUpload, onBase64Upload, previewImage }: AboutImageUploadProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const maxNumber = 1;

  const onChange = (imageList: ImageType[]) => {
    const base64Images = imageList.map((image) => image.data_url);
    setImages(imageList);
    onImageUpload(imageList);
    onBase64Upload(base64Images);
  };

  useEffect(() => {
    previewImage = '';
  }, [images]);

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
        <div className="upload__image-wrapper">
          <button
            type={'button'}
            className={'painike'}
            style={isDragging ? {color: 'red'} : undefined}
            onClick={onImageUpload}
            {...dragProps}
          >
            Valitse kuva
          </button>
          &nbsp;
          {!previewImage && imageList.length === 0 && (
            <div className="image-item">
              <div className={'image-placeholder'} />
            </div>
          )}

          {imageList.length > 0 && (
            imageList.map((image: ImageType, index: number) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100"/>
                <div className="image-item__btn-wrapper">
                  <button type={'button'} className={'painike'} onClick={() => onImageUpdate(index)}>Vaihda</button>
                  <button type={'button'} className={'painike'} onClick={() => onImageRemove(index)}>Poista</button>
                </div>
              </div>
            ))
          )}

          {previewImage && imageList.length === 0 && (
            <div className="image-item">
              <img src={previewImage} alt="" width="100"/>
            </div>
          )}
        </div>
      )}
    </ImageUploading>
  );
}

export default AboutImageUpload;
