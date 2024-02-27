import ImageUploading from 'react-images-uploading';
import { ImageType } from "react-images-uploading/dist/typings";
import { useState } from "react";

interface ImageUploadProps {
  onImageUpload: (images: ImageType[]) => void;
  onBase64Upload: (base64Images: string[]) => void;
}

function ImageUpload({ onImageUpload, onBase64Upload }: ImageUploadProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const maxNumber = 69;

  const onChange = (imageList: ImageType[]) => {
    const base64Images = imageList.map((image) => image.data_url);
    setImages(imageList);
    onImageUpload(imageList);
    onBase64Upload(base64Images);
  };

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
          {imageList.length === 0 && (
            <div className="image-item">
              <div className={'image-placeholder'} />
            </div>
          )}
          {imageList.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image['data_url']} alt="" width="100"/>
              <div className="image-item__btn-wrapper">
                <button className={'painike'} onClick={() => onImageUpdate(index)}>Vaihda</button>
                <button className={'painike'} onClick={() => onImageRemove(index)}>Poista</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
}

export default ImageUpload;
