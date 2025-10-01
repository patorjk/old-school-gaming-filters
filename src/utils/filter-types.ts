import { nesPalette, type PaletteData } from "@/utils/nes-palette.ts";

interface FilterType {
  numColors: number;
  ditherStyle: string;
  srcImg: string;
  height: number;
  width: number;
  palette?: PaletteData;
  dither?: string | null;
}

const filterTypes: Record<string, FilterType> = {
  game_boy_camera: {
    numColors: 4,
    ditherStyle: "Ordered4x4",
    srcImg: "./image-references/game_boy_camera.png",
    height: 112,
    width: 128,
  },
  game_boy_camera2: {
    numColors: 4,
    ditherStyle: "FloydSteinberg",
    srcImg: "./image-references/game_boy_camera.png",
    height: 112,
    width: 128,
  },

  game_boy_screen_ordered: {
    numColors: 4,
    ditherStyle: "Ordered4x4",
    srcImg: "./image-references/gameboy_1.png",
    height: 144,
    width: 160,
  },
  game_boy_screen_floyd: {
    numColors: 4,
    ditherStyle: "FloydSteinberg",
    srcImg: "./image-references/gameboy_1.png",
    height: 144,
    width: 160,
  },

  nes: {
    numColors: 56,
    ditherStyle: "FloydSteinberg",
    srcImg: "./image-references/NES_palette2.png",
    height: 240,
    width: 256,
    palette: nesPalette,
  },
  nes_restricted: {
    numColors: 56,
    ditherStyle: "FloydSteinberg",
    srcImg: "./image-references/NES_palette2.png",
    height: 240,
    width: 256,
    palette: nesPalette,
  },

  appleII: {
    numColors: 6,
    ditherStyle: "FloydSteinberg",
    srcImg: "./image-references/appleII_highres.png",
    height: 192,
    width: 280,
  },

  virtual_boy: {
    numColors: 4,
    ditherStyle: "FloydSteinberg",
    srcImg: "./image-references/virtual_boy.png",
    height: 224,
    width: 384,
  },
};

export { filterTypes };
