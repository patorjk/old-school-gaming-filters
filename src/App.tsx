import "./App.css";
import { useCallback, useState, useEffect, type ChangeEvent } from "react";
import ImageLoader from "@/components/ImageLoader.tsx";
import { createImage, noDitherList } from "@/utils/create-image.ts";

function App() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [filterName, setFilterName] = useState<string>("nes");
  const [dither, setDither] = useState<boolean>(true);

  const handleFilterNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterName(e.target.value);
  };

  const handleDitherChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDither(e.target.checked);
  };

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setInputImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClearImage = useCallback(() => {
    setImage(null);
    setInputImage(null);
  }, []);

  useEffect(() => {
    if (inputImage) {
      const img = new Image();
      img.onload = () => {
        const doWork = async () => {
          const canvas = await createImage(filterName, img, dither);
          if (!canvas) {
            return;
          }
          setImage(canvas.toDataURL("image/png"));
        };
        doWork().catch((err) => console.error(err));
        return;
      };
      img.src = inputImage;
    }
  }, [inputImage, filterName, dither]);

  /*
                    <option value={"game_boy_screen_ordered"}>
                    Game Boy Screen (Ordered Dither)
                  </option>
   */

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 w-full`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold `}>Old School Gaming Filters</h1>
          <p className={`text-lg`}>
            Creates a version of an image for an old school gaming console
          </p>
        </div>
        <ImageLoader
          image={image}
          inputImage={inputImage}
          handleImageUpload={handleImageUpload}
          handleClearImage={handleClearImage}
        />
        <div className="mt-12 nes-container with-title">
          <p className={`title`}>Options</p>
          <div className={"flex flex-col gap-8"}>
            <div className={"text-left"}>
              <label htmlFor="default_select">Game System</label>
              <div className="nes-select">
                <select
                  required
                  id="game_system"
                  value={filterName}
                  onChange={handleFilterNameChange}
                >
                  <option value={"appleII"}>Apple II</option>
                  <option value={"game_boy_camera"}>Game Boy Camera</option>
                  <option value={"game_boy_screen_floyd"}>
                    Game Boy Screen
                  </option>
                  <option value={"nes"}>Nintendo (NES)</option>
                  <option value={"virtual_boy"}>Virtual Boy</option>
                </select>
              </div>
            </div>
            <div
              className={`text-left ${noDitherList.indexOf(filterName) !== -1 ? "opacity-40" : ""}`}
            >
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox"
                  checked={dither}
                  onChange={handleDitherChange}
                  disabled={noDitherList.indexOf(filterName) !== -1}
                />
                <span>
                  Dither (you'll see what this does when you toggle it)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
