import React, { useState, useCallback, useEffect } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  image: File | null;
  onImageChange: (file: File | null) => void;
  disabled: boolean;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, image, onImageChange, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
      // Clear the file input's value so the same file can be re-selected
      const fileInput = document.getElementById(id) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [image, id]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
  }, [onImageChange]);

  return (
    <div className="flex flex-col items-center">
      <label htmlFor={id} className="text-lg font-semibold text-gray-300 mb-2">{label}</label>
      <div className="w-full h-48 bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:border-blue-500 hover:bg-gray-800/60 cursor-pointer group">
        <input
          id={id}
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={disabled}
        />
        {preview ? (
          <img src={preview} alt="Reactant preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-400">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;