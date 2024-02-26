import ImageUploading from 'react-images-uploading';
import { ImageType } from "react-images-uploading/dist/typings";
import { useState } from "react";

interface ImageUploadProps {
  onImageUpload: (images: ImageType[]) => void;
  onBase64Upload: (base64Images: string[]) => void; // Add callback for base64 images
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
            style={isDragging ? {color: 'red'} : undefined}
            onClick={onImageUpload}
            {...dragProps}
          >
            Valitse kuva
          </button>
          &nbsp;
          {imageList.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image['data_url']} alt="" width="100"/>
              <div className="image-item__btn-wrapper">
                <button onClick={() => onImageUpdate(index)}>Update</button>
                <button onClick={() => onImageRemove(index)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
}

export default ImageUpload;
