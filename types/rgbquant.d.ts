// Add type declaration for rgbquant
declare module "rgbquant" {
  export default class RgbQuant {
    constructor(options?: {
      colors?: number;
      palette?: any[];
      dithKern?: string;
      dithDelta?: number;
      dithSerp?: boolean;
      reIndex?: boolean;
      useCache?: boolean;
      cacheIndx?: boolean;
      minHueCols?: number;
      hueStats?: boolean;
    });

    sample(canvas: HTMLCanvasElement, width?: number): void;

    palette(tuples?: boolean): any[];

    reduce(
      canvas: HTMLCanvasElement,
      retType?: number,
      dithKern?: string | null,
    ): Uint8ClampedArray;
  }
}
