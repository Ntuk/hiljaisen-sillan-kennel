import ImageUploading from 'react-images-uploading';
import Resizer from "react-image-file-resizer";
import { ImageType } from "react-images-uploading/dist/typings";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  onImageUpload: (images: ImageType[]) => void;
  onBase64Upload: (base64Images: string[]) => void;
  previewImage?: string;
}

function ImageUpload({ onImageUpload, onBase64Upload, previewImage }: ImageUploadProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const maxNumber = 69;

  const onChange = async (imageList: ImageType[]) => {
    try {
      const resizedImages = await Promise.all(imageList.map(async (image) => {
        const resizedImage = await resizeImage(image.file);
        return {
          ...image,
          data_url: resizedImage,
        };
      }));
      const base64Images: string[] = resizedImages.map((image) => image.data_url);
      setImages(resizedImages);
      onImageUpload(resizedImages);
      onBase64Upload(base64Images);
    } catch (error) {
      console.error("Error resizing images:", error);
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        450,
        450,
        'PNG',
        100,
        0,
        (uri) => {
          resolve(uri as string);
        },
        'base64',
        450,
        450
      );
    });
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

export default ImageUpload;
