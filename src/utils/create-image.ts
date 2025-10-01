import { filterTypes } from "@/utils/filter-types.ts";
import RgbQuant from "rgbquant";

// --- image stuff

function typeOf(val: unknown): string {
  return Object.prototype.toString.call(val).slice(8, -1);
}

function drawPixels(
  inputImage: HTMLImageElement,
  idxi8: Uint8ClampedArray<ArrayBufferLike>,
  width0: number,
  width1?: number,
) {
  const idxi32 = new Uint32Array(idxi8.buffer);

  width1 = width1 || width0;

  const can = document.createElement("canvas");
  const can2 = document.createElement("canvas");
  const ctx = can.getContext("2d");
  const ctx2 = can2.getContext("2d");

  if (!ctx) throw new Error("no context");
  if (!ctx2) throw new Error("no context");

  ctx.imageSmoothingEnabled = false;

  can.width = width0;
  can.height = Math.ceil(idxi32.length / width0);
  can2.width = width1;
  can2.height = Math.ceil((can.height * width1) / width0);

  ctx.imageSmoothingEnabled = false;
  ctx2.imageSmoothingEnabled = false;

  const imgd = ctx.createImageData(can.width, can.height);

  if (typeOf(imgd.data) == "CanvasPixelArray") {
    const data = imgd.data;
    for (let i = 0, len = data.length; i < len; ++i) data[i] = idxi8[i];
  } else {
    const buf32 = new Uint32Array(imgd.data.buffer);
    buf32.set(idxi32);
  }

  ctx.putImageData(imgd, 0, 0);

  // resize back to proper size
  can2.width = inputImage.width;
  can2.height = inputImage.height;

  ctx2.imageSmoothingEnabled = false;
  ctx2.drawImage(can, 0, 0, can2.width, can2.height);

  return can2;
}

export const noDitherList = [
  "game_boy_camera",
  "game_boy_camera2",
  "game_boy_screen_ordered",
];

export const createImage = async (
  filterName: string,
  inputImage: HTMLImageElement,
  ditheringOn: boolean = true,
) => {
  const filterType = { ...filterTypes[filterName] };

  if (ditheringOn) {
    if (noDitherList.indexOf(filterName) === -1) {
      filterType.dither = filterType.ditherStyle;
    }
  } else {
    filterType.dither = undefined;
  }

  let refImageCanvas: HTMLCanvasElement;
  let inputResizedCanvas: HTMLCanvasElement;

  return new Promise<void>(function (resolve, reject) {
    // set the ref image
    //console.log("set the ref image");

    const img = new Image();
    refImageCanvas = document.createElement("canvas");
    if (!refImageCanvas) {
      return reject();
    }
    const ctx = refImageCanvas.getContext("2d");
    if (!ctx) {
      return reject();
    }

    img.onload = function () {
      refImageCanvas.width = img.width;
      refImageCanvas.height = img.height;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = function () {
      reject();
    };

    img.src = filterType.srcImg;
  })
    .then(function () {
      // set the resized input
      //console.log("set the resized input");

      inputResizedCanvas = document.createElement("canvas");
      const context = inputResizedCanvas.getContext("2d");
      if (!context) throw new Error("no context");

      context.clearRect(
        0,
        0,
        inputResizedCanvas.width,
        inputResizedCanvas.height,
      );

      let newW = inputImage.width;
      let newH = inputImage.height;

      if (
        filterType.height < inputImage.height &&
        inputImage.height >= inputImage.width
      ) {
        newW = Math.round(
          filterType.height * (inputImage.width / inputImage.height),
        );
        newH = filterType.height;
      } else if (filterType.width < inputImage.width) {
        newW = filterType.width;
        newH = Math.round(
          filterType.width * (inputImage.height / inputImage.width),
        );
      }

      //console.log("new width:" + newW);
      //console.log("new height:" + newH);
      //console.log("draw resized input");

      inputResizedCanvas.width = newW;
      inputResizedCanvas.height = newH;

      context.imageSmoothingEnabled = false;
      context.drawImage(inputImage, 0, 0, newW, newH);

      return;
    })
    .then(function () {
      //console.log("do actual processing...");

      let numColors = filterType.numColors;
      const refCanvas = refImageCanvas;
      const inputCanvas = inputResizedCanvas;
      let q, pal;

      if (filterType.palette) {
        pal = filterType.palette;
        numColors = pal.length;
      } else {
        q = new RgbQuant({
          colors: numColors,
        });
        q.sample(refCanvas);
        pal = q.palette(true);
      }

      const q2 = new RgbQuant({
        colors: numColors,
        palette: pal,
      });

      let ditheringType = filterType.dither;
      if (ditheringType === "") ditheringType = null;

      const out = q2.reduce(inputCanvas, 1, ditheringType);

      const pcan = drawPixels(inputImage, out, inputCanvas.width); //1920
      pcan.setAttribute("id", "outCan");

      return pcan;
    })
    .catch(function (err) {
      alert("Something went wrong :(");
      console.error(err);
    });
};
