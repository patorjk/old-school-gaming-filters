import { Upload } from "lucide-react";
import UploadIcon from "../assets/upload_svg.svg?react";
import React, { useState } from "react";

interface ImageLoaderProps {
  image: string | null;
  handleImageUpload: (file: File) => void;
  handleClearImage: () => void;
}

const ImageLoader = ({
  image,
  handleImageUpload,
  handleClearImage,
}: ImageLoaderProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  return (
    <>
      {!image ? (
        <div
          className={`mb-8 relative border-3 border-dashed p-16 text-center transition-all ${
            dragActive
              ? "border-indigo-500 bg-opacity-50"
              : "border-slate-300 dark:border-slate-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadIcon className={`w-16 h-16 mx-auto mb-4`} />
          <h3 className={`text-xl font-semibold  mb-2`}>
            Drop your image here
          </h3>
          <p className={` mb-6`}>or click below to browse</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 cursor-pointer transition-colors nes-btn is-primary"
          >
            Choose File
          </label>
        </div>
      ) : (
        <div className={`nes-container with-title `}>
          <p className={`title`}>Result</p>
          <button
            onClick={handleClearImage}
            className={`absolute top-[-4px] right-[-4px] z-10 p-2 px-[10px] text-black dark:text-white bg-white dark:bg-black hover:opacity-80 transition-opacity`}
          >
            X
          </button>
          <img
            src={image}
            alt="Uploaded"
            className="w-auto h-auto align-self justify-self"
          />
        </div>
      )}
    </>
  );
};

export default ImageLoader;
