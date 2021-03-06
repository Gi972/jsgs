export default class Screen {
  constructor(options) {
    this.type = 'defaultScreen';
    this.px = options.size / 128;
    this.size = options.size;
    this.palette = options.palette || this.constructor.defaultPalette;
    this.canvas = this.createCanvas(options);
    this.ctx = this.canvas.getContext('2d');
  }

  update(ram) {
    for (let addr = 0x6000; addr <= 0x7FFF; addr++) {
      const data = ram.arr[addr];
      const dataBinary = ("000000000" + data.toString(2)).substr(-8);
      const [color1, color2] = [
        this.palette[
          parseInt(dataBinary.substring(0, 4), 2)
        ],
        this.palette[
          parseInt(dataBinary.substring(4, 8), 2)
        ],
      ];

      const i = addr - 0x6000;
      const x = (i * 2) % 128;
      const y = Math.floor(i / 64);

      this.ctx.fillStyle = color1;
      this.ctx.fillRect(x * this.px, y * this.px, this.px, this.px);

      this.ctx.fillStyle = color2;
      this.ctx.fillRect(x * this.px + this.px, y * this.px, this.px, this.px);
    };
  }

  createCanvas({ element, size }) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;

    canvas.style.dispay = 'block';
    canvas.style.imageRendering = 'pixelated';

    return canvas;
  }

  mountCanvas(element) {
    element.appendChild(this.canvas);
  }
}

Screen.utils = {};

Screen.utils.hexToRgb = function(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

Screen.utils.componentToHex = function(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

Screen.utils.rgbToHex = function({r, g, b}) {
  return "#" + Screen.utils.componentToHex(r) + Screen.utils.componentToHex(g) + Screen.utils.componentToHex(b);
}


Screen.defaultPalette = [
  '#000000', '#1D2B53', '#7E2553', '#008751',
  '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
  '#FF004D', '#FFA300', '#FFEC27', '#00E436',
  '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA',
];

Screen.grayscalePalette = Screen.defaultPalette.map(color => {
  const { r, g, b } = Screen.utils.hexToRgb(color);
  const w = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
  return Screen.utils.rgbToHex({ r: w, g: w, b: w });
});

Screen.greenPalette = Screen.defaultPalette.map(color => {
  const { r, g, b } = Screen.utils.hexToRgb(color);
  const rbc = Math.floor((0.299 * r + 0.587 * g + 0.114 * b) * (1/2));
  const gc = Math.floor(rbc * 2);
  return Screen.utils.rgbToHex({ r: rbc, g: gc, b: rbc });
});
