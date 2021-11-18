import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
const ImageCropper: React.FC<any> = (props): any => {
  const { imageToCrop, onImageCropped } = props;

  const [cropConfig, setCropConfig] = useState<any>(
    // default crop config
    {
      unit: '%',
      aspect: 4 / 4,
    },
  );

  const [imageRef, setImageRef] = useState<any>();

  async function cropImage(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef,
        crop,
        'croppedImage.png', // destination filename
      );

      // calling the props function to expose
      // croppedImage to the parent component
      onImageCropped(croppedImage);
    }
  }

  async function getCroppedImage(sourceImage, cropConfig, fileName) {
    // creating the cropped image from the source image
    const canvas = document.createElement('canvas');
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        // returning an error
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        //@ts-ignore
        blob.name = fileName;
        const CropImg = [new File([blob], fileName)];
        // creating a Object URL representing the Blob object given
        const croppedImageUrl = window.URL.createObjectURL(blob);
        resolve([croppedImageUrl, CropImg]);
      }, 'image/jpeg');
    });
  }

  return (
    <ReactCrop
      style={{ width: '700px' }}
      src={imageToCrop || ''}
      crop={cropConfig}
      ruleOfThirds
      onImageLoaded={(imageRef) => setImageRef(imageRef)}
      onComplete={(cropConfig) => cropImage(cropConfig)}
      onChange={(cropConfig) => setCropConfig(cropConfig)}
      crossorigin="anonymous" // to avoid CORS-related problems
    />
  );
};

export default ImageCropper;
