import ImageUploading from 'react-images-uploading';
import { ImageType, ImageListType } from "react-images-uploading/dist/typings";
import { useState } from "react";

function ImageUpload() {
  const [images, setImages] = useState<ImageType[]>([]);
  const maxNumber = 69;

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
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
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
        // write your building UI
        <div className="upload__image-wrapper">
          <button
            style={isDragging ? {color: 'red'} : undefined}
            onClick={onImageUpload}
            {...dragProps}
          >
            Klikkaa tai pudota tähän
          </button>
          &nbsp;
          <button onClick={onImageRemoveAll}>Poista kaikki kuvat</button>
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
  )
}

export default ImageUpload
