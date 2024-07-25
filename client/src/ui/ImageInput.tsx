import React from 'react';

import style from '../styles/input/imageInput.module.scss';
import { ImageInputProps } from 'interface';


const ImageInput = ({label='Select Image', onFileSelected}:ImageInputProps) => {
    const [selectedImage, setSelecetdImage] = React.useState<string | null>(null);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelecetdImage(e?.target?.result as string);
            };
            reader.readAsDataURL(file);
            console.log("file loaded", file);
            
            if(onFileSelected){
                onFileSelected(file);
            }
        }
    };

    return (
        <div className={`${style['file-input']}`}>
            {selectedImage ? (
                <img
                    src={selectedImage}
                    alt="Photo"
                    className={style['previewImage']}
                />
            ) : (
                <span>{label}</span>
            )}

            <input type="file" onChange={handleImage} />
        </div>
    );
};

export default ImageInput;
