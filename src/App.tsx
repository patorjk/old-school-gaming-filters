import "./App.css";
import { useCallback, useState, useEffect } from "react";
import ImageLoader from "@/components/ImageLoader.tsx";

function App() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClearImage = useCallback(() => {
    setImage(null);
  }, []);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        console.log("analyze!");
      };
      img.src = image;
    }
  }, [image]);

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 w-full`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold `}>Old School Gaming Filters</h1>
          <p className={`text-lg`}>
            See what an image would look like on an old school gaming console
          </p>
        </div>
        <ImageLoader
          image={image}
          handleImageUpload={handleImageUpload}
          handleClearImage={handleClearImage}
        />
      </div>
    </div>
  );
}

export default App;
